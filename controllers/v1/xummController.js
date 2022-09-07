
// simple async arrow func to req transaction
const xummSdk = async (apiKey, apiSectet, destination, amount, userToken) => {

    //  accessing xumm account via xumm sdk
    const sdk = new XummSdk(apiKey, apiSectet)

    const request = {  
        "txjson": {  
            "TransactionType": "Payment",  
            "Destination": destination, 
            "Amount": amount, 
        },  
        "user_token": userToken  
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



