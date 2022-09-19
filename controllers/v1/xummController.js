const express = require("express");


const { XummSdk } = require('xumm-sdk')
//  accessing xumm account via xumm sdk
const sdk = new XummSdk(process.env.API_KEY, process.env.API_SECRET)

//  post /api/v1/xumm/getUserToken
exports.getUserToken = async (req, res) => {
  const request = {
    "options": {
      "submit": false,
      "expire": 240,
    },
    "txjson": {
      "TransactionType": "SignIn" // Dummy transaction type to trigger login
    }
  }

  const subscription = await sdk.payload.createAndSubscribe(request, event => {
    if (Object.keys(event.data).indexOf('signed') > -1) {
      return event.data
    }
  })

  console.log('Open this URL and scan the QR code: ', subscription.created.next.always)

  const resolveData = await subscription.resolved
  if (!resolveData.signed) {
    console.log('The request was rejected.')
    res.status(400).json({
      success: false,
    });

  } else {
    console.log('The request was signed.')
    const result = await sdk.payload.get(resolveData.payload_uuidv4)
    console.log('User_token: ', result.application.issued_user_token)

    res.status(201).json({
      success: true,
      userToken: result.application.issued_user_token,
    });
  }
}

