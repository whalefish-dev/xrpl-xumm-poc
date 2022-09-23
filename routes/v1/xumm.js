const express = require("express");
const { getUserToken } = require("../../controllers/v1/xummController");
const app = express();

// initalize xumm routes
// localhost:4000/api/v1/xumm/getUserToken
app.route("/getUserToken").get(getUserToken);

module.exports = app;
