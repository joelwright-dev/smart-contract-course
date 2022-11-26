require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		goerli: {
			url: process.env.GOERLI_RPC_URL,
			accounts: [process.env.PRIVATE_KEY],
			chainId: 5,
		},
		localhost: {
			url: "http://127.0.0.1:8545",
			chainId: 31337,
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	gasReporter: {
		enabled: true,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
	},
	solidity: "0.8.17",
}
