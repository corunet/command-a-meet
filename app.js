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
		const { user_id, channel_name, text: title } = req.body

		const eventTitle = title || `${channel_name} (Mattermost)`

		const email = await getEmail({
			id: user_id,
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

		const { hangoutLink } = await createEvent(gCalendar, eventTitle)
		const responseText = title || `Join the meeting`
		res.json({
			text: `${responseText} at ${hangoutLink}`,
			response_type: "in_channel"
		})
	} catch (e) {
		console.error("ERROR", e)
		res.sendStatus(503)
	}
})

exports.app = app
