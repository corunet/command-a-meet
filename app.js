const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")
const express = require("express")
const { createEvent } = require("./calendar-utils/calendar")
const { getEmail } = require("./mattermost-utils/users")
const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))

const configPath = path.join(__dirname, "config.json")
const config = JSON.parse(fs.readFileSync(configPath))

app.get("/", async (req, res) => {
	res.send("Mattermost - Google Meet integration")
})
app.post("/meet", async (req, res) => {
	try {
		const email = await getEmail({
			id: req.body.user_id,
			token: config.mattermost.token,
			API_url: config.mattermost.api
		})
		const { credentials } = config.google
		const auth = new google.auth.JWT(
			credentials.client_email,
			null,
			credentials.private_key,
			["https://www.googleapis.com/auth/calendar"],
			email
		)
		const gCalendar = await google.calendar({
			version: "v3",
			auth
		})

		const title = "An event" //TO-DO: get from request
		const { hangoutLink } = await createEvent(gCalendar, title)
		res.json({
			text: `Join the meeting at ${hangoutLink}`,
			response_type: "in_channel"
		})
	} catch (e) {
		console.error("ERROR", e)
		res.sendStatus(503)
	}
})

exports.app = app
