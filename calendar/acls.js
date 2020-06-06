const addACL = function (gCalendar, calendarId, type, value) {
	return gCalendar.acl.insert({
		calendarId,
		resource: {
			role: "reader",
			scope: {
				type,
				value
			}
		}
	})
}

exports.addUser = function (gCalendar, calendarId, user) {
	return addACL(gCalendar, calendarId, "user", user)
}

exports.addGroup = function (gCalendar, calendarId, group) {
	return addACL(gCalendar, calendarId, "group", group)
}
