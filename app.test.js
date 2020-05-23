const request = require("supertest")
const { app } = require("./app")
const mattermostUsersUtils = require("./mattermost-utils/users")

// Mocks
jest.mock("./mattermost-utils/users")
const calendarUtils = require("./calendar-utils/calendar")
jest.mock("./calendar-utils/calendar")
const googleapis = require("googleapis")
jest.mock("googleapis")

const testUserEmail = "user@example.com"
const testHangoutLink = "https://meet.example.com/aMeeting"

const testUser_id = "testUser_id"

test("request a meeting", (done) => {
	mattermostUsersUtils.getEmail.mockResolvedValue(testUserEmail)
	calendarUtils.createEvent.mockResolvedValue({
		hangoutLink: testHangoutLink
	})
	const gCalendarMocked = {}
	googleapis.google.calendar.mockResolvedValue(gCalendarMocked)

	request(app)
		.post("/meet")
		.send({ user_id: testUser_id })
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err)
			expect(res.body.text).toBe(`Join the meeting at ${testHangoutLink}`)
			expect(res.body.response_type).toBe("in_channel")
			expect(calendarUtils.createEvent).toHaveBeenCalledWith(gCalendarMocked, "An event")
			done()
		})
})
