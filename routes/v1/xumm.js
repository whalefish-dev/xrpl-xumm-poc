const express = require("express");
const {
getUserToken
} = require("../../controllers/v1/xummController");
const router = express.Router();

// initalize xumm routes
// localhost:4000/api/v1/xumm/getUserToken 
router.route("/getUserToken").post(getUserToken);

module.exports = router;