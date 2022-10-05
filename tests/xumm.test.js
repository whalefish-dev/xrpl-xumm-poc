const request = require("supertest");
const app = require("../routes/v1/xumm");

jest.mock("open")
jest.mock("xumm-sdk", () => {
  return {
    XummSdk: jest.fn().mockImplementation(() => {
      return {
        payload: {
          createAndSubscribe: jest.fn().mockResolvedValueOnce({
            created: { next: { always: "https://dummy_xumm_url.com" } },
            resolved : jest.fn().mockResolvedValueOnce({signed: true, payload_uuidv4: "some_uuid"})()
          }),
          get: jest.fn().mockResolvedValueOnce({application: {issued_user_token: "dummyUserToken"}}),
        },
      };
    }),
  };
});

describe("XUMM Endpoints", () => {
  it("should return a 201 and user token", async () => {
    const res = await request(app).get("/getUserToken");
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("userToken");
    expect(res.body.userToken).toEqual("dummyUserToken")
  });
  // TODO: Add a test for returning a 400 error
});
