const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")
const express = require("express")
const { createEvent } = require("./calendar-utils/calendar")
const { getEmail } = require("./mattermost-utils/users")
const app = express()
app.use(express.static("public"))
app.use(express.urlencoded())

const PORT = 3000

const configPath = path.join(__dirname, "config.json")
const config = JSON.parse(fs.readFileSync(configPath))

app.get("/", async (req, res) => {
	res.send("Mattermost - Google Meet integration")
})
app.post("/meet", async (req, res) => {
	try {
		const email = await getEmail(req.body.user_id, config.mattermost.token)
		const { credentials } = config.google
		const auth = new google.auth.JWT(
			credentials.client_email,
			null,
			credentials.private_key,
			["https://www.googleapis.com/auth/calendar"],
			email
		)
		const gCalendar = google.calendar({
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

app.listen(PORT, () => console.log(`Listening at :${PORT}`))
