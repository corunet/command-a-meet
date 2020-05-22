const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")
const express = require("express")
const { createEvent } = require("./calendar-utils/calendar")
const app = express()
app.use(express.static("public"))

const PORT = 3000
const CALENDAR_ID = "bm28kde2rsnt1va19tp08adjh0@group.calendar.google.com"

const keyfile = path.join(__dirname, "credentials.json")
const keys = JSON.parse(fs.readFileSync(keyfile))

app.get("/", async (req, res) => {
	res.send("Mattermost - Google Meet integration")
})
app.post("/meet", async (req, res) => {
	try {
		const auth = new google.auth.JWT(
			keys.client_email,
			null,
			keys.private_key,
			["https://www.googleapis.com/auth/calendar"],
			req.query.user
		)
		const gCalendar = google.calendar({
			version: "v3",
			auth
		})

		const title = "An event" //TO-DO: get from request
		const { hangoutLink } = await createEvent(gCalendar, event)
		res.json({
			text: `Join the meeting at ${hangoutLink}`,
			response_type: "in_channel"
		})
	} catch (e) {
		console.error(JSON.stringify(e))
		res.sendStatus(503)
	}
})

app.listen(PORT, () => console.log(`Listening at :${PORT}`))
