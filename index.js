const { google } = require("googleapis")
const path = require("path")
const fs = require("fs")

const keyfile = path.join(__dirname, "credentials.json")
const keys = JSON.parse(fs.readFileSync(keyfile))
//const CALENDAR_ID = "corunet.com_sbk6pl4il2amtvkh22r3ijcoo4@group.calendar.google.com"
const CALENDAR_ID = "bm28kde2rsnt1va19tp08adjh0@group.calendar.google.com"
const TIMEZONE = "Europe/Madrid"

function addACL(calendar, user) {
	return calendar.acl.insert({
		calendarId: CALENDAR_ID,
		resource: {
			role: "reader",
			scope: {
				type: "user",
				value: user
			}
		}
	})
}

async function main() {
	const auth = google.auth.fromJSON(keys)
	auth.scopes = ["https://www.googleapis.com/auth/calendar"]

	const calendar = google.calendar({
		version: "v3",
		auth
	})

	const now = new Date()
	console.log(
		await calendar.events.insert({
			calendarId: CALENDAR_ID,
			resource: {
				start: {
					dateTime: "2020-05-16T12:15:00",
					timeZone: TIMEZONE
				},
				end: {
					dateTime: "2020-05-16T12:45:00",
					timeZone: TIMEZONE
				},
				summary: `A test - ${now.toISOString()}`
			}
		})
	)
}

main().catch(console.error)
