const express = require("express");
const { createOrder } = require("../../controllers/v1/ccxtController");
const app = express();

// initalize ccxt routes
// localhost:4000/api/v1/ccxt/createOrder
app.route("/createOrder").get(createOrder);

module.exports = app;
