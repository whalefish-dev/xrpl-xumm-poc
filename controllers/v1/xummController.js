const express = require("express");


// simple async arrow func to req transaction
const {XummSdk} = require('xumm-sdk') //xumm sdk input
const env = require('dotenv');
env.config({path: './.env'})


//  post /api/v1/xumm/getToken/
exports.sendXrp = async (apiKey, apiSectet, destination, amount, userToken) => {

    //  accessing xumm account via xumm sdk
    const sdk = new XummSdk(apiKey, apiSectet)

    const request = {  
        "txjson": {  
            "TransactionType": "SignIn",  
            "Destination": destination, 
            "Amount": amount, 
        },  
        // "user_token": userToken   
      }  


    const subscription = await sdk.payload.createAndSubscribe(request, event => {  
        if(Object.keys(event.data).indexOf('signed') > -1){  
            return event.data  
        }  
    })   
    console.log('sign request URL',subscription.created.next.always)  
    console.log('Pushed ',subscription.created.pushed ? 'Yes' : 'No')  

    const resolveData = await subscription.resolved  
    if(resolveData.signed == false){  
        console.log('The request was rejected!')  
        }else{  
        console.log('The request was Signed!!')  
        const result = await sdk.payload.get(resolveData.payload_uuidv4)  
        console.log('User_token: ',result.application.issued_user_token)  
    }

  }
  
  // Stand-alone code for "trading in the decentralized exchange"
//   xummSdk(process.env.API_KEY, process.env.API_SECRET, process.env.DESTINATION, "1000000", process.env.USER_TOKEN)


//  post /api/v1/xumm/getToken/
exports.getUserToken = async (req, res) => {

    //  accessing xumm account via xumm sdk
    const sdk = new XummSdk(process.env.API_KEY, process.env.API_SECRET)

    const request = { 
        "options": {
          "submit": false,
          "expire": 240,
          "return_url": {
            "app": "https://xrptipbot.com/signin?payload={id}",
            "web": "https://xrptipbot.com/signin?payload={id}"
          }
        },
        // "user_token": "c5bc4ccc-28fa-4080-b702-0d3aac97b993",
        "txjson": {
          "TransactionType" : "SignIn"
        }
      }


    const subscription = await sdk.payload.createAndSubscribe(request, event => {  
        if(Object.keys(event.data).indexOf('signed') > -1){  
            return event.data  
        }  
    })   
    console.log('sign request URL',subscription.created.next.always)  
    console.log('Pushed ',subscription.created.pushed ? 'Yes' : 'No')  

    const resolveData = await subscription.resolved  
    if(resolveData.signed == false){  
        console.log('The request was rejected!')  
        }else{  
        console.log('The request was Signed!!')  
        const result = await sdk.payload.get(resolveData.payload_uuidv4)  
        console.log('User_token: ',result.application.issued_user_token)  

        res.status(201).json({
            success: true,
            'User_token: ': result.application.issued_user_token,
          });
    }

    
  }
  





