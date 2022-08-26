const {XummSdk} = require('xumm-sdk') //xumm sdk input



// simple async arrow func to req transaction
const xummSdk = async (apiKey, apiSectet, destination) => {

    //  accessing xumm account via xumm sdk
    const sdk = new XummSdk(apiKey, apiSectet)

    const appInfo = await sdk.ping()
    console.log(appInfo.application.name)
  
    const request = {
      "TransactionType": "Payment",
      "Destination": destination,
      "Amount": "10000",
      "Memos": [
        {
          "Memo": {
            "MemoData": "F09F988E20596F7520726F636B21"
          }
        }
      ]
    }
  
    const payload = await sdk.payload.create(request, true)
    console.log(payload)
  }
  
  xummSdk('007fbac7-5bef-476d-b309-658605d70c71', '0b193697-36eb-473d-a9f5-9d4e18938d0b', 'rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ')// Stand-alone code sample for "trade in the decentralized exchange" tutorial:

// https://xrpl.org/trade-in-the-decentralized-exchange.html

// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
    var BigNumber = require('bignumber.js')
  }
  
  // Connect ---------------------------------------------------------------------
  async function xrplTransact() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    console.log("Connecting to Testnet...")
    await client.connect()
  
    // Get credentials from the Testnet Faucet -----------------------------------
    console.log("Requesting address from the Testnet faucet...")
    const wallet = (await client.fundWallet()).wallet
    console.log(`Got address ${wallet.address}.`)
    const we_want = {
      currency: "TST",
      issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
      value: "25"
    }
    const we_spend = {
      currency: "XRP",
             // 25 TST * 10 XRP per TST * 15% financial exchange (FX) cost
      value: xrpl.xrpToDrops(25*10*1.15)
    }
    const proposed_quality = BigNumber(we_spend.value) / BigNumber(we_want.value)
  
    // Look up Offers. -----------------------------------------------------------
    // To buy TST, look up Offers where "TakerGets" is TST:
    const orderbook_resp = await client.request({
      "command": "book_offers",
      "taker": wallet.address,
      "ledger_index": "current",
      "taker_gets": we_want,
      "taker_pays": we_spend
    })
    console.log(JSON.stringify(orderbook_resp.result, null, 2))
  
    const offers = orderbook_resp.result.offers
    const want_amt = BigNumber(we_want.value)
    let running_total = BigNumber(0)
    if (!offers) {
      console.log(`No Offers in the matching book.
                   Offer probably won't execute immediately.`)
    } else {
      for (const o of offers) {
        if (o.quality <= proposed_quality) {
          console.log(`Matching Offer found, funded with ${o.owner_funds}
              ${we_want.currency}`)
          running_total = running_total.plus(BigNumber(o.owner_funds))
          if (running_total >= want_amt) {
            console.log("Full Offer will probably fill")
            break
          }
        } else {
          // Offers are in ascending quality order, so no others after this
          // will match, either
          console.log(`Remaining orders too expensive.`)
          break
        }
      }
      console.log(`Total matched:
            ${Math.min(running_total, want_amt)} ${we_want.currency}`)
      if (running_total > 0 && running_total < want_amt) {
        console.log(`Remaining ${want_amt - running_total} ${we_want.currency}
              would probably be placed on top of the order book.`)
      }
    }
  
    if (running_total == 0) {
      const orderbook2_resp = await client.request({
        "command": "book_offers",
        "taker": wallet.address,
        "ledger_index": "current",
        "taker_gets": we_spend,
        "taker_pays": we_want
      })
      console.log(JSON.stringify(orderbook2_resp.result, null, 2))
  
      // Since TakerGets/TakerPays are reversed, the quality is the inverse.
      // You could also calculate this as 1/proposed_quality.
      const offered_quality = BigNumber(we_want.value) / BigNumber(we_spend.value)
  
      const offers2 = orderbook2_resp.result.offers
      let tally_currency = we_spend.currency
      if (tally_currency == "XRP") { tally_currency = "drops of XRP" }
      let running_total2 = 0
      if (!offers2) {
        console.log(`No similar Offers in the book. Ours would be the first.`)
      } else {
        for (const o of offers2) {
          if (o.quality <= offered_quality) {
            console.log(`Existing offer found, funded with
                  ${o.owner_funds} ${tally_currency}`)
            running_total2 = running_total2.plus(BigNumber(o.owner_funds))
          } else {
            console.log(`Remaining orders are below where ours would be placed.`)
            break
          }
        }
        console.log(`Our Offer would be placed below at least
              ${running_total2} ${tally_currency}`)
        if (running_total > 0 && running_total < want_amt) {
          console.log(`Remaining ${want_amt - running_total} ${tally_currency}
                will probably be placed on top of the order book.`)
        }
      }
    }
  
    // Send OfferCreate transaction ----------------------------------------------
    const offer_1 = {
      "TransactionType": "OfferCreate",
      "Account": wallet.address,
      "TakerPays": we_want,
      "TakerGets": we_spend.value // since it's XRP
    }
  
    const prepared = await client.autofill(offer_1)
    console.log("Prepared transaction:", JSON.stringify(prepared, null, 2))
    const signed = wallet.sign(prepared)
    console.log("Sending OfferCreate transaction...")
    const result = await client.submitAndWait(signed.tx_blob)
    if (result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded:
            https://testnet.xrpl.org/transactions/${signed.hash}`)
    } else {
      throw `Error sending transaction: ${result}`
    }
  
    // Check metadata ------------------------------------------------------------
    // In JavaScript, you can use getBalanceChanges() to help summarize all the
    const balance_changes = xrpl.getBalanceChanges(result.result.meta)
    console.log("Total balance changes:", JSON.stringify(balance_changes, null,2))
  
    // Helper to convert an XRPL amount to a string for display
    function amt_str(amt) {
      if (typeof amt == "string") {
        return `${xrpl.dropsToXrp(amt)} XRP`
      } else {
        return `${amt.value} ${amt.currency}.${amt.issuer}`
      }
    }
  
    let offers_affected = 0
    for (const affnode of result.result.meta.AffectedNodes) {
      if (affnode.hasOwnProperty("ModifiedNode")) {
        if (affnode.ModifiedNode.LedgerEntryType == "Offer") {
          // Usually a ModifiedNode of type Offer indicates a previous Offer that
          // was partially consumed by this one.
          offers_affected += 1
        }
      } else if (affnode.hasOwnProperty("DeletedNode")) {
        if (affnode.DeletedNode.LedgerEntryType == "Offer") {
          // The removed Offer may have been fully consumed, or it may have been
          // found to be expired or unfunded.
          offers_affected += 1
        }
      } else if (affnode.hasOwnProperty("CreatedNode")) {
        if (affnode.CreatedNode.LedgerEntryType == "RippleState") {
          console.log("Created a trust line.")
        } else if (affnode.CreatedNode.LedgerEntryType == "Offer") {
          const offer = affnode.CreatedNode.NewFields
          console.log(`Created an Offer owned by ${offer.Account} with
            TakerGets=${amt_str(offer.TakerGets)} and
            TakerPays=${amt_str(offer.TakerPays)}.`)
        }
      }
    }
    console.log(`Modified or removed ${offers_affected} matching Offer(s)`)
  
    // Check balances ------------------------------------------------------------
    console.log("Getting address balances as of validated ledger...")
    const balances = await client.request({
      command: "account_lines",
      account: wallet.address,
      ledger_index: "validated"
      // You could also use ledger_index: "current" to get pending data
    })
    console.log(JSON.stringify(balances.result, null, 2))
  
    // Check Offers --------------------------------------------------------------
    console.log(`Getting outstanding Offers from ${wallet.address} as of validated ledger...`)
    const acct_offers = await client.request({
      command: "account_offers",
      account: wallet.address,
      ledger_index: "validated"
    })
    console.log(JSON.stringify(acct_offers.result, null, 2))
  
    client.disconnect()
  } // End of main()
  
//   xrplTransact()