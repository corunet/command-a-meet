const { createEvent } = require("./calendar")

const startDateTime = "ISO Date: 0"

const expectedDefaultArgument = {
	calendarId: "primary",
	conferenceDataVersion: 1,
	resource: {
		start: { dateTime: startDateTime },
		end: { dateTime: "ISO Date: 30" },
		summary: "A meeting",
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

test("create an event with title", async () => {
	const title = "A really extraordinary event"
	const result = await createEvent(gCalendar, title)
	expect(result).toEqual(eventData)
	const expectedArgument = {
		...expectedDefaultArgument,
		resource: {
			...expectedDefaultArgument.resource,
			summary: title
		}
	}
	expect(gCalendar.events.insert).toHaveBeenCalledWith(expectedArgument)
})
test("create an event with no title", async () => {
	const result = await createEvent(gCalendar)
	expect(result).toEqual(eventData)
	expect(gCalendar.events.insert).toHaveBeenCalledWith(expectedDefaultArgument)
})
