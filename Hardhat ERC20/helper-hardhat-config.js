const networkConfig = {
	31337: {
		name: "hardhat",
	},
	// Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
	5: {
		name: "goerli",
		ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
	},
}

const developmentChains = ["hardhat", "localhost"]
const INITIAL_SUPPLY = "1000000000000000000000000"

module.exports = {
	networkConfig,
	developmentChains,
	INITIAL_SUPPLY,
}
