const fetch = require("node-fetch")
const { getEmail } = require("./users")

const testId = "test Id"
const testEmail = "test Email"
const testToken = "theWonderfulToken"
const testAPI_url = "http://example.com/api/users"
jest.mock("node-fetch")

test("get an user email", async () => {
	fetch.mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({ email: testEmail })
		})
	)
	const response = await getEmail({
		id: testId,
		token: testToken,
		API_url: testAPI_url
	})

	expect(response).toBe(testEmail)
	expect(fetch).toHaveBeenCalledWith(
		`${testAPI_url}/${testId}`,
		expect.objectContaining({
			headers: expect.objectContaining({
				Authorization: expect.stringMatching(/^Bearer \w+$/)
			})
		})
	)
})
