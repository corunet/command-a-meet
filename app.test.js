const request = require("supertest")
const { app } = require("./app")

// Mocks
const { getEmail } = require("./mattermost/users")
jest.mock("./mattermost/users")
const { createEvent } = require("./calendar/calendar")
jest.mock("./calendar/calendar")
const { google } = require("googleapis")
jest.mock("googleapis")
jest.mock("./config.json", () => ({
	mattermost: {
		api: {
			url: "http://mock.url/api",
			token: "Mocked token"
		},
		slash_command_token: "The mocked slash command token"
	},
	google: {
		credentials: {}
	}
}))

const testUserEmail = "user@example.com"
const testHangoutLink = "https://meet.example.com/aMeeting"
const testUser_id = "testUser_id"

getEmail.mockResolvedValue(testUserEmail)
createEvent.mockResolvedValue({
	hangoutLink: testHangoutLink
})

const mattermostSlashArguments = {
	user_id: testUser_id,
	channel_name: "test channel_name",
	token: "The mocked slash command token"
}

test("request a meeting with title", (done) => {
	const gCalendarMocked = {}
	google.calendar.mockResolvedValue(gCalendarMocked)
	const titleFromMattermost = "A title set from Mattermost"

	request(app)
		.post("/meet")
		.type("form")
		.send({
			...mattermostSlashArguments,
			text: titleFromMattermost
		})
		.set("Accept", "application/json")
		.expect(200)
		.expect("Content-Type", /json/)
		.end(function (err, res) {
			if (err) return done(err)
			expect(res.body.text).toBe(`${titleFromMattermost} at ${testHangoutLink}`)
			expect(res.body.response_type).toBe("in_channel")
			expect(createEvent).toHaveBeenCalledWith(gCalendarMocked, titleFromMattermost)
			done()
		})
})

test("request a meeting", (done) => {
	const gCalendarMocked = {}
	google.calendar.mockResolvedValue(gCalendarMocked)

	request(app)
		.post("/meet")
		.type("form")
		.send(mattermostSlashArguments)
		.set("Accept", "application/json")
		.expect(200)
		.expect("Content-Type", /json/)
		.end(function (err, res) {
			if (err) return done(err)
			expect(res.body.text).toBe(`Join the meeting at ${testHangoutLink}`)
			expect(res.body.response_type).toBe("in_channel")
			expect(createEvent).toHaveBeenCalledWith(
				gCalendarMocked,
				`${mattermostSlashArguments.channel_name} (Mattermost)`
			)
			done()
		})
})

test("Denied if there the token is not the REAL token", (done) => {
	const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
	request(app)
		.post("/meet")
		.type("form")
		.send({
			...mattermostSlashArguments,
			token: "Fake news!"
		})
		.set("Accept", "application/json")
		.expect(403)
		.expect("Content-Type", /text/)
		.end(() => {
			expect(warnSpy).toHaveBeenCalledWith("A valid token is required")
			expect(createEvent).toHaveBeenCalledTimes(0)
			done()
		})
})
