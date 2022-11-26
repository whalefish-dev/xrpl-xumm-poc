const { XummSdk } = require("xumm-sdk"); // xumm sdk input
const { Client, xrpToDrops } = require("xrpl");
const env = require("dotenv");
env.config({ path: "./.env" });

const xrplURL = "wss://xrplcluster.com";

//  post /api/v1/xrp/test
exports.test = async (req, res, next) => {
  console.log("testing");
  res.status(201).json({
    success: true,
    data: "hello world",
  });
};

// @desc    create offer on the dex (xrp ledger)
// @route   post /api/v1/xrp/createOffer
// @access  Private(public for now)
exports.createOffer = async (req, res, next) => {
  // Connect to XRP ledger
  const client = new Client(xrplURL);
  console.log("Connecting to production XRPL server...");
  await client.connect();

  // Parse request body

  const body = req.body;
  const weWant = {
    currency: body.weWant.currency,
    issuer: body.address,
    value: body.weWant.value,
  };
  const weSpend = {
    currency: body.weSpend.currency,
    value: xrpToDrops(body.weSpend.value),
  };

  // Create offer transaction

  const offer = {
    TransactionType: "OfferCreate",
    Account: body.address,
    TakerPays: weWant,
    TakerGets: weSpend.value, // since it's XRP
  };
  const prepared = await client.autofill(offer);
  console.log("Prepared transaction:", JSON.stringify(prepared, null, 2));

  // Send the offerCreate transaction to be signed and sent to the ledged

  const sdk = new XummSdk(process.env.API_KEY, process.env.API_SECRET);
  const request = {
    txjson: prepared,
    user_token: body.userToken,
  };
  console.log("Sending OfferCreate transaction...");

  const subscription = await sdk.payload.createAndSubscribe(
    request,
    (event) => {
      if (Object.keys(event.data).indexOf("signed") > -1) {
        return event.data;
      }
    }
  );

  // Get response regarding the transaction

  const resolveData = await subscription.resolved;
  const result = await sdk.payload.get(resolveData.payload_uuidv4);

  if (result.response.dispatched_result === "tesSUCCESS") {
    console.log("Transaction succeeded");
  } else {
    throw Error(`Error sending transaction: ${result}`);
  }

  // Return success code and disconnect from XRPL server

  res.status(201).json({
    success: true,
  });
  client.disconnect();
};
