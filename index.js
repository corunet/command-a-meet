const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")
const express = require("express")
const { createEvent } = require("./calendar-utils/calendar")
const app = express()

const PORT = 3000
const CALENDAR_ID = "bm28kde2rsnt1va19tp08adjh0@group.calendar.google.com"

const keyfile = path.join(__dirname, "credentials.json")
const keys = JSON.parse(fs.readFileSync(keyfile))

const auth = google.auth.fromJSON(keys)
auth.scopes = ["https://www.googleapis.com/auth/calendar"]
const gCalendar = google.calendar({
	version: "v3",
	auth
})

app.get("/", async (req, res) => {
	res.send("Mattermost - Google Meet integration")
})
app.post("/meet", async (req, res) => {
	try {
		const { hangoutLink } = await createEvent(gCalendar, CALENDAR_ID)
		res.send(`Join the meeting at ${hangoutLink}`)
	} catch (e) {
		console.error(JSON.stringify(e))
		res.sendStatus(503)
	}
})

app.listen(PORT, () => console.log(`Listening at :${PORT}`))
