# Connect to xumm sdk

set 1) make sure you have yarn package manager install 
step 3) clone repo with: git clone (repo)
step 3) in your terminal, run 'yarn install'  // to istall all the require packages 
step 4) in your terminal, run 'yarn dev' 


step 5) use postman to submit data to the below routes

localhost:4000/api/v1/xrp/test     (for testing)
        whatever data you want to pass
localhost:4000/api/v1/xrp/createOffer     (create offer on xrpl lerger production server)
        json data

        {
            "secret": "---family seed---",
            "weWant": {
                "currency": "currency",
                "value": "value"
            },
            "weSpend": {
                "currency": "currency",
                "value": "value"
            }
        }


1)get user token without cash transaction  -->
# visit : localhost:4000/api/v1/xrp/getUserToken
# you will get a qrcode,
# scan to sign request 
# user token will be generated on the fly