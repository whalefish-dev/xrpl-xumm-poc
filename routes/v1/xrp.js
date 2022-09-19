const express = require("express");
const {
  createOffer,
  test
} = require("../../controllers/v1/xrpController");
const router = express.Router();

// initalize xrp routes
// api/v1/xrp/createOffer 
router.route("/createOffer").post(createOffer);

// for testing
// api/v1/xrp/test 
router.route("/test").post(test);


module.exports = router;