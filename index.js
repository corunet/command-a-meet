const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")
const { createEvent } = require("./calendar-utils/calendar")

const CALENDAR_ID = "bm28kde2rsnt1va19tp08adjh0@group.calendar.google.com"
const keyfile = path.join(__dirname, "credentials.json")
const keys = JSON.parse(fs.readFileSync(keyfile))
//const CALENDAR_ID = "corunet.com_sbk6pl4il2amtvkh22r3ijcoo4@group.calendar.google.com"

async function main() {
	const auth = google.auth.fromJSON(keys)
	auth.scopes = ["https://www.googleapis.com/auth/calendar"]

	const gCalendar = google.calendar({
		version: "v3",
		auth
	})

	const { hangoutLink } = await createEvent(gCalendar, CALENDAR_ID)
	console.log(`Join the meeting at ${hangoutLink}`)
}

main().catch(console.error)
