const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", function () {
	let fundMe
	let deployer
	let mockV3Aggregator
	const sendValue = ethers.utils.parseEther("1")

	beforeEach(async function () {
		deployer = (await getNamedAccounts()).deployer
		await deployments.fixture(["all"])
		fundMe = await ethers.getContract("FundMe", deployer)
		mockV3Aggregator = await ethers.getContract(
			"MockV3Aggregator",
			deployer
		)
	})

	describe("constructor", function () {
		it("sets the aggregator addresses correctly", async function () {
			const response = await fundMe.getPriceFeed()
			assert.equal(response, mockV3Aggregator.address)
		})
	})

	describe("fund", function () {
		it("fails if you don't send enough ETH", async function () {
			await expect(fundMe.fund()).to.be.revertedWith(
				"You need to spend more ETH!"
			)
		})
		it("Updates the amount funded data structure", async () => {
			await fundMe.fund({ value: sendValue })
			const response = await fundMe.getAddressToAmountFunded(deployer)
			console.log(response.toString(), sendValue.toString())
			assert.equal(response.toString(), sendValue.toString())
		})
	})
})
