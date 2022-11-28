require("dotenv").config()

require("./tasks/block-number")
require("solidity-coverage")

require("hardhat-deploy")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		goerli: {
			url: process.env.GOERLI_RPC_URL,
			accounts: [process.env.PRIVATE_KEY],
			chainId: 5,
			blockConfigrmations: 6,
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
	namedAccounts: {
		deployer: {
			default: 0,
		},
		user: {
			default: 1,
		},
	},
	solidity: {
		compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
	},
}
