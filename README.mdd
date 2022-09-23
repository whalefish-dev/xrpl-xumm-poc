# XUMM-XRPL Proof of Concept

This repo demonstrates a Proof of Concept application for sending offers to the XRPL Decentralised Exchange (DEX) using the XUMM app for authentication.

## Installation

The application itself is a node js application so make sure to have node js installed in your environment. To install the requirements run:

```bash
yarn install
```

The script to demo the application is written in python. Ensure you have python3 installed in your (ideally virtual) environment and run:

```bash
pip install -r requirements.txt
```

## Run the demo

First you need to create a `.env` file in the root directory with the following keys:

- `NODE_ENV`: Used by the node server. If this is set to 'development', middleware logging will be done.
- `API_KEY`: XUMM Developer Application API Key. Used by the node server to communicate with XUMM.
- `API_SECRET`: XUMM Developer Application API Secret. Used by the node server to communicate with XUMM.
- `WALLET_ADDRESS`: Used by the python code to know which wallet to transact under.

Then, open two terminals. In the first terminal run:

```bash
yarn dev
```

This will start the development server which will respond to requests that our python script will send to it.

In the second terminal run:

```bash
python -m scripts.poc_demo
```

This will send two requests to our server. The first will open your default web browser displaying a QR code which you must scan with your XUMM app and sign the transaction to retrieve a user token. This user token will then be used in the second request in order to send a push notification to the user to sign the offer transaction that will be sent to the DEX instead of having them scan a QR code. Ensure your XUMM app has access to the wallet you are using to perform the transaction.
