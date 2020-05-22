const fetch = require("node-fetch")
const API_url = "https://mattermost.local/api/v4/users"

exports.getEmail = async function (id) {
	const userResponse = await fetch(`${API_url}/${id}`, {
		headers: {
			Authorization: "Bearer <token>"
		}
	})
	const { email } = await userResponse.json()

	return email
}
