const fetch = require("node-fetch")

exports.getEmail = async function ({ id, token, API_url }) {
	const userResponse = await fetch(`${API_url}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	const { email } = await userResponse.json()

	return email
}
