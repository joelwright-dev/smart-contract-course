## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# Hard Hat Fund Me

A set of contracts made to fund a contract and be withdrawn by the owner of the contract. This was created with a course (12 hours in).

## Installation

Install with npm

```bash
  npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GOERLI_RPC_URL`,`PRIVATE_KEY`,`ETHERSCAN_API_KEY`,`COINMARKETCAP_API_KEY`

## Running Tests

To run tests locally, run the following command

```bash
npm test
```

To run tests on the Goerli testnet, run the following commands

```bash
npx hardhat node
npm test:staging
```
