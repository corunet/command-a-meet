const fetch = require("node-fetch")
const { getEmail } = require("./users")

const testId = "test Id"
const testEmail = "test Email"
jest.mock("node-fetch")

test("get an user email", async () => {
	fetch.mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({ email: testEmail })
		})
	)
	expect(await getEmail(testId)).toBe(testEmail)
	expect(fetch).toHaveBeenCalledWith(
		expect.stringContaining(`/api/v4/users/${testId}`),
		expect.objectContaining({
			headers: expect.objectContaining({
				Authorization: expect.stringMatching(/^Bearer \w+$/)
			})
		})
	)
})
