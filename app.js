const express = require("express");
const morgan = require("morgan");
const {XummSdk} = require('xumm-sdk') //xumm sdk input
const env = require('dotenv');
const { RippleAPI } = require('ripple-lib').RippleAPI;
const cors = require("cors");
const xss = require("xss-clean");
env.config({path: './.env'})

// init express
const app = express();

// body parser
app.use(express.json());

// prevent cross site scriptin
app.use(xss());

// enable cors
app.use(cors());

// v1 routes input
const xrp = require("./routes/v1/xrp.js");

// dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

// mount v1 routers
app.use("/api/v1/xrp", xrp);
 
// init port for server to run
const PORT = process.env.PORT || 4000;

// process server and listening message
app.listen(
    PORT,
    console.log(
      `Server is running in ${process.env.NODE_ENV} MODE on port ${PORT} `
    )
  );
  

