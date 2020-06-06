const { addUser, addGroup } = require("./acls")

const gCalendar = {
	acl: {
		insert: jest.fn()
	}
}

test("add a user", () => {
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

	addUser(gCalendar, calendarId, user)
	expect(gCalendar.acl.insert).toHaveBeenCalledWith(expectedCallArgument)
})

test("add a group", () => {
	const calendarId = "The calendar ID"
	const group = "A test group"

	const expectedCallArgument = {
		calendarId,
		resource: {
			role: "reader",
			scope: {
				type: "group",
				value: group
			}
		}
	}

	addGroup(gCalendar, calendarId, group)
	expect(gCalendar.acl.insert).toHaveBeenCalledWith(expectedCallArgument)
})
