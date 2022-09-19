"""Proof of concept demo script.

This script fetches a user token from XUMM before creating an OfferCreate
transaction which it sends to XUMM for signing before sending on to the XRPL
Decentralised exchange.
"""
import logging
import requests

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def get_user_token() -> str:
    """Returns user token."""
    response = requests.post("http://localhost:4000/api/v1/xumm/getUserToken", {})
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
        logger.info("Retrieved user token")
    except Exception as e:
        logger.error("Error encountered whilst getting user token.")
        raise e
    try:
        success = send_offer(
            user_token=user_token,
            wallet_address="rN1qS7tsyA2168ApYG7QGsakwJ6JRyuoP",
            buy_currency="USD",
            buy_value=0.3461,
            sell_currency="XRP",
            sell_value=1.
        )
        if success:
            logger.info("Successfully sent transaction to the XRPL")
        else:
            logger.error("Error in sending transaction to the XRPL")
    except Exception as e:
        logger.error("Error encountered whilst sending transaction.")
        raise e
