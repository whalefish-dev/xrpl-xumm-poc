const express = require("express");
const {
  getUserToken
} = require("../../controllers/v1/xummController");
const router = express.Router();

// initalize xrp routes
// localhost:4000/api/v1/xumm/gettoken 
router.route("/gettoken").post(getUserToken);

module.exports = router;