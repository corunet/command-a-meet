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

mattermostUsersUtils.getEmail.mockResolvedValue(testUserEmail)
calendarUtils.createEvent.mockResolvedValue({
	hangoutLink: testHangoutLink
})

const mattermostSlashArguments = {
	user_id: testUser_id,
	channel_name: "test channel_name"
}

test("request a meeting with title", (done) => {
	const gCalendarMocked = {}
	googleapis.google.calendar.mockResolvedValue(gCalendarMocked)
	const titleFromMattermost = "A title set from Mattermost"

	request(app)
		.post("/meet")
		.type("form")
		.send({
			...mattermostSlashArguments,
			text: titleFromMattermost
		})
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err)
			expect(res.body.text).toBe(`${titleFromMattermost} at ${testHangoutLink}`)
			expect(res.body.response_type).toBe("in_channel")
			expect(calendarUtils.createEvent).toHaveBeenCalledWith(gCalendarMocked, titleFromMattermost)
			done()
		})
})

test("request a meeting", (done) => {
	const gCalendarMocked = {}
	googleapis.google.calendar.mockResolvedValue(gCalendarMocked)

	request(app)
		.post("/meet")
		.type("form")
		.send(mattermostSlashArguments)
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(200)
		.end(function (err, res) {
			if (err) return done(err)
			expect(res.body.text).toBe(`Join the meeting at ${testHangoutLink}`)
			expect(res.body.response_type).toBe("in_channel")
			expect(calendarUtils.createEvent).toHaveBeenCalledWith(
				gCalendarMocked,
				`${mattermostSlashArguments.channel_name} (Mattermost)`
			)
			done()
		})
})
