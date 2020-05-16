const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")

const keyfile = path.join(__dirname, "credentials.json")
const keys = JSON.parse(fs.readFileSync(keyfile))
//const CALENDAR_ID = "corunet.com_sbk6pl4il2amtvkh22r3ijcoo4@group.calendar.google.com"
const CALENDAR_ID = "bm28kde2rsnt1va19tp08adjh0@group.calendar.google.com"
const TIMEZONE = "Europe/Madrid"

async function createEvent() {
	const auth = google.auth.fromJSON(keys)
	auth.scopes = ["https://www.googleapis.com/auth/calendar"]

	const calendar = google.calendar({
		version: "v3",
		auth
	})

	const now = new Date().toISOString()
	const event = await calendar.events.insert({
		calendarId: CALENDAR_ID,
		conferenceDataVersion: 1,
		resource: {
			start: {
				dateTime: "2020-05-16T12:15:00",
				timeZone: TIMEZONE
			},
			end: {
				dateTime: "2020-05-16T12:45:00",
				timeZone: TIMEZONE
			},
			summary: `A test - ${now}`,
			conferenceData: {
				createRequest: {
					requestId: now,
					conferenceSolutionKey: {
						type: "hangoutsMeet"
					}
				}
			}
		}
	})

	return event.data
}

async function main() {
	const { hangoutLink } = await createEvent()
	console.log(`Join the meeting at ${hangoutLink}`)
}

main().catch(console.error)
