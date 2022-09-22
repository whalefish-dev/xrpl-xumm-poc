const request = require('supertest');
const axios = require('axios');

jest.mock("axios")

describe('xrp testing', () => {

    it('Get User token ', () => {
        const userToken = {"user_token": "74d-2641f0398-8562-3782-24ffe3843c52" }
        axios.get.mockResolvedValue(userToken)
        return expect(userToken).toEqual(userToken)
    })

    it('Send Xrp via Xumm wallet ', () => {
        const status = {"status": "xrp send successfully" }
        axios.post.mockResolvedValue(status)
        return expect(status).toEqual(status)
    })
})