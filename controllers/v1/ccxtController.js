const env = require("dotenv");
const ccxt = require("ccxt");
env.config({ path: "./.env" });

//  post /api/v1/ccxt/createOrder
exports.createOrder = async (req, res, next) => {
  console.log("Creating order...");
  const body = req.body;
  const exchangeId = body.exchangeId;
  const ExchangeClass = ccxt[exchangeId];
  const exchange = new ExchangeClass({
    enableRateLimit: true,
  });

  const order = await exchange.createOrder(
    body.symbol,
    body.type,
    body.side,
    body.quantity,
    body.price,
    { icebergQty: body.icebergQty }
  );

  if (order) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
