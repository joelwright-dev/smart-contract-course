const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", () => {
	let fundMe
	let deployer
	let mockV3Aggregator
	const sendValue = ethers.utils.parseEther("1")

	beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer
		await deployments.fixture(["all"])
		fundMe = await ethers.getContract("FundMe", deployer)
		mockV3Aggregator = await ethers.getContract(
			"MockV3Aggregator",
			deployer
		)
	})

	describe("constructor", () => {
		it("Sets the aggregator addresses correctly", async () => {
			const response = await fundMe.getPriceFeed()
			assert.equal(response, mockV3Aggregator.address)
		})
	})

	describe("fund", () => {
		it("Fails if you don't send enough ETH", async () => {
			await expect(fundMe.fund()).to.be.revertedWith(
				"You need to spend more ETH!"
			)
		})

		it("Updates the amount funded data structure", async () => {
			await fundMe.fund({ value: sendValue })
			const response = await fundMe.getAddressToAmountFunded(deployer)
			assert.equal(response.toString(), sendValue.toString())
		})

		it("Adds funder to array of s_funders", async () => {
			await fundMe.fund({ value: sendValue })
			const funder = await fundMe.s_funders(0)
			assert.equal(funder, deployer)
		})
	})

	describe("withdraw", () => {
		beforeEach(async () => {
			await fundMe.fund({ value: sendValue })
		})

		it("Withdraws ETH from a single funder", async () => {
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			)
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			)

			const transactionResponse = await fundMe.withdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)

			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			)
			const endingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			)

			assert.equal(endingFundMeBalance, 0)
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			)
		})

		it("Withdraws ETH from multiple s_funders", async () => {
			const accounts = await ethers.getSigners()
			for (let i = 1; i < 6; i++) {
				const fundMeConnectedContract = await fundMe.connect(
					accounts[i]
				)
				await fundMeConnectedContract.fund({ value: sendValue })
			}

			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			)
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			)

			const transactionResponse = await fundMe.withdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)

			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			)
			const endingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			)

			assert.equal(endingFundMeBalance, 0)
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			)

			await expect(fundMe.s_funders(0)).to.be.reverted

			for (i = 1; i < 6; i++) {
				assert.equal(
					await fundMe.getAddressToAmountFunded(accounts[i].address),
					0
				)
			}
		})

		it("Only allows the owner to withdraw funds", async () => {
			const accounts = await ethers.getSigners()
			const attacker = accounts[1]
			const attackerConnectedContract = await fundMe.connect(attacker)
			await expect(
				attackerConnectedContract.withdraw()
			).to.be.revertedWith("FundMe__NotOwner")
		})

		it("CheaperWithdraw testing...", async () => {
			const accounts = await ethers.getSigners()
			for (let i = 1; i < 6; i++) {
				const fundMeConnectedContract = await fundMe.connect(
					accounts[i]
				)
				await fundMeConnectedContract.fund({ value: sendValue })
			}

			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			)
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			)

			const transactionResponse = await fundMe.cheaperWithdraw()
			const transactionReceipt = await transactionResponse.wait(1)
			const { gasUsed, effectiveGasPrice } = transactionReceipt
			const gasCost = gasUsed.mul(effectiveGasPrice)

			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			)
			const endingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			)

			assert.equal(endingFundMeBalance, 0)
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			)

			await expect(fundMe.s_funders(0)).to.be.reverted

			for (i = 1; i < 6; i++) {
				assert.equal(
					await fundMe.getAddressToAmountFunded(accounts[i].address),
					0
				)
			}
		})
	})
})
