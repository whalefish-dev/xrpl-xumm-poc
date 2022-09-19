"""Proof of concept demo script.

This script fetches a user token from XUMM before creating an OfferCreate
transaction which it sends to XUMM for signing before sending on to the XRPL
Decentralised exchange.
"""
import logging
import os
import requests
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)


def get_user_token() -> str:
    """Returns user token."""
    logging.info("Requesting user token")
    response = requests.get("http://localhost:4000/api/v1/xumm/getUserToken")
    return response.json()["userToken"]


def send_offer(
    user_token: str,
    wallet_address: str,
    sell_currency: str,
    buy_currency: str,
    sell_value: float,
    buy_value: float,
) -> bool:
    "Sends offer to XRP ledger Decentralised exchange."
    logging.info("Sending offer to XRPL")
    response = requests.post(
        "http://localhost:4000/api/v1/xrp/createOffer",
        json={
            "address": wallet_address,
            "userToken": user_token,
            "weWant": {"currency": buy_currency, "value": str(buy_value)},
            "weSpend": {"currency": sell_currency, "value": str(sell_value)},
        },
    )
    return response.ok


if __name__ == "__main__":
    try:
        user_token = get_user_token()
        logging.info("Retrieved user token")
    except Exception as e:
        logging.error("Error encountered whilst getting user token.")
        raise e
    try:
        success = send_offer(
            user_token=user_token,
            wallet_address=os.environ["WALLET_ADDRESS"],
            buy_currency="USD",
            buy_value=0.3461,
            sell_currency="XRP",
            sell_value=1.
        )
        if success:
            logging.info("Successfully sent transaction to the XRPL")
        else:
            logging.error("Error in sending transaction to the XRPL")
    except Exception as e:
        logging.error("Error encountered whilst sending transaction.")
        raise e
