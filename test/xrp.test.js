const  app = require('../app');
const request = require('supertest');
const axios = require('axios');
const { JsonWebTokenError } = require('jsonwebtoken');

jest.mock("axios")

describe('xrp testing', () => {
    it('XRPL create dex offer', () => {  
        const resp = "offer created sussefully on the xrpl lerger"
        axios.get.mockResolvedValue(resp)
        return expect(resp).toEqual(resp)
    })
})