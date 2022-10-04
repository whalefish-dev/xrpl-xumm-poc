const  app = require('../app');
const request = require('supertest');

jest.mock("open")
jest.mock("xrpl", () => {
  return {
    XrpTest: jest.fn().mockImplementation(() => {
      return {
        payload: {
          createAndSubscribe: jest.fn().mockResolvedValueOnce({
            created: { next: { always: "https://dummy_xrp_url.com" } },
            resolved : jest.fn().mockResolvedValueOnce({transactionComplete: true, offerAmount: "SomeOfferAmount"})()
          }),
          get: jest.fn().mockResolvedValueOnce({application: {OfferCreated: true}}),
        },
      };
    }),
  };
});


describe("xrp Endpoints", () => {
    it("should return a 201 and offer amount", async () => {
      const res = await request(app).get("/createoffer");
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("success");
      expect(res.body).toHaveProperty("offerAmount");
      expect(res.body.offerAmount).toEqual("dummyofferamount")
    });
    // TODO: Add a test for returning a 400 error
  });