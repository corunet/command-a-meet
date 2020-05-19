exports.addACL = function (gCalendar, calendarId, user) {
	return gCalendar.acl.insert({
		calendarId,
		resource: {
			role: "reader",
			scope: {
				type: "user",
				value: user
			}
		}
	})
}
