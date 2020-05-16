exports.addACL = function (calendar, user) {
	return calendar.acl.insert({
		calendarId: CALENDAR_ID,
		resource: {
			role: "reader",
			scope: {
				type: "user",
				value: user
			}
		}
	})
}
