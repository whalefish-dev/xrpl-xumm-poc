const app = require("../routes/v1/xrp");
const request = require('supertest');

jest.mock("xrpl", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn().mockResolvedValueOnce(),
        disconnect: jest.fn().mockResolvedValueOnce(),
        autofill: jest.fn().mockResolvedValueOnce({data: "data"}),
      };
    }),
    xrpToDrops: jest.fn()
  };
});
jest.mock("xumm-sdk", () => {
  return {
    XummSdk: jest.fn().mockImplementation(() => {
      return {
        payload: {
          createAndSubscribe: jest.fn().mockResolvedValueOnce({
            resolved : jest.fn().mockResolvedValueOnce({payload_uuidv4: "some_uuid"})()
          }),
          get: jest.fn().mockResolvedValueOnce({response: {dispatched_result: "tesSUCCESS"}}),
        },
      };
    }),
  };
});

describe("xrp Endpoints", () => {
  it("should return a 201 and success", async () => {
    const res = await request(app)
      .post("/createOffer")
      .send({
        "address": "dummy_allet_address",
        "userToken": "dummy_user_token",
        "weWant": {"currency": "USDX", "value": "123"},
        "weSpend": {"currency": "OXLS", "value": "456"},
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success");
  });
});