const TIMEZONE = "Europe/Madrid"

function getEventISODates() {
	const start = new Date()
	const end = new Date()
	end.setMinutes(end.getMinutes() + 30)
	return {
		startDateTime: start.toISOString(),
		endDateTime: end.toISOString()
	}
}

exports.createEvent = async function (gCalendar, calendarId) {
	const { startDateTime, endDateTime } = getEventISODates()
	const event = await gCalendar.events.insert({
		calendarId,
		conferenceDataVersion: 1,
		resource: {
			start: { dateTime: startDateTime },
			end: { dateTime: endDateTime },
			summary: `A test - ${startDateTime}`,
			conferenceData: {
				createRequest: {
					requestId: startDateTime,
					conferenceSolutionKey: {
						type: "hangoutsMeet"
					}
				}
			}
		}
	})

	return event.data
}
