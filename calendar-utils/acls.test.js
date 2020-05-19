const { addACL } = require("./acls")

test("Insert an ACL", () => {
	const gCalendar = {
		acl: {
			insert: jest.fn()
		}
	}
	const calendarId = "The calendar ID"
	const user = "A test user"

	const expectedCallArgument = {
		calendarId,
		resource: {
			role: "reader",
			scope: {
				type: "user",
				value: user
			}
		}
	}

	addACL(gCalendar, calendarId, user)

	expect(gCalendar.acl.insert).toHaveBeenCalledWith(expectedCallArgument)
})
