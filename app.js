const {XummSdk} = require('xumm-sdk') //xumm sdk input
const env = require('dotenv');
env.config({path: './.env'})

// accessing xumm account via xumm sdk
const sdk = new XummSdk(process.env.API_KEY, process.env.API_SECRET)

// simple async arrow func to req transaction
const main =  async () => {
    const request = {
        "TransactionType": "Payment",
        "Destination": 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
        "Amount": "1000000",
        "Memo": [{
            "Memo": {"MemoData": 'F09F94A520563686E69'}
        }]
    }

    const payload = await sdk.payload.create(request, true)

    console.log(payload)
}
main()