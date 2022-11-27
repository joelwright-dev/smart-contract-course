const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments
	const { deployer } = await getNamedAccounts()
	const chainId = network.config.chainId

	let ethUsdPriceFeedAddress
	if (developmentChains.includes(network.name)) {
		const ethUsdAggregator = await deployments.get("MockV3Aggregator")
		ethUsdPriceFeedAddress = ethUsdAggregator.address
	} else {
		const ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
	}

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [ethUsdPriceFeedAddress],
		log: true,
	})
	log("-------------------------------------------")
}

module.exports.tags = ["fund-me", "all"]
