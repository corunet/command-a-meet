const { createEvent } = require("./calendar")

test("create an event", async () => {
	jest.spyOn(global, "Date").mockImplementation(() => {
		let date = 0
		return {
			getMinutes: () => date,
			setMinutes: (minutes) => {
				date = minutes
			},
			toISOString: () => `ISO Date: ${date}`
		}
	})
	const eventData = "An event"
	const gCalendar = {
		events: {
			insert: jest.fn(() => Promise.resolve({ data: eventData }))
		}
	}
	const calendarId = "The calendar ID"
	const startDateTime = "ISO Date: 0"

	const expectedCallArgument = {
		calendarId,
		conferenceDataVersion: 1,
		resource: {
			start: { dateTime: startDateTime },
			end: { dateTime: "ISO Date: 30" },
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
	}

	const result = await createEvent(gCalendar, calendarId)
	expect(result).toEqual(eventData)
	expect(gCalendar.events.insert).toHaveBeenCalledWith(expectedCallArgument)
})
