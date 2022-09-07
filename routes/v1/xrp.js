const express = require("express");
const {
  createOffer,
  test
} = require("../../controllers/v1/xrpController");
const router = express.Router();

// initalize xrp routes
router.route("/createdexoffer").post(createOffer);
router.route("/test").post(test);


module.exports = router;