const express = require("express");
const {
  createOffer,
  test
} = require("../../controllers/v1/xrpController");
const router = express.Router();

// initalize xrp routes
router.route("/createdexoffer").post(createOffer);

// post route
// api/v1/xrp/test 
router.route("/test").post(test);


module.exports = router;