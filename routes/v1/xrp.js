const bodyParser = require('body-parser');
const express = require("express");
const { createOffer, test } = require("../../controllers/v1/xrpController");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// initalize xrp routes
// api/v1/xrp/createOffer
app.route("/createOffer").post(createOffer);

// for testing
// api/v1/xrp/test
app.route("/test").get(test);

module.exports = app;
