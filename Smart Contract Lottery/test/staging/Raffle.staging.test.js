const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {
	developmentChains,
	networkConfig,
} = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
	? describe.skip
	: describe("Raffle Unit Tests", () => {
			let raffle, raffleEntranceFee, deployer, interval, player

			beforeEach(async () => {
				const accounts = await getNamedAccounts()
				deployer = accounts.deployer
				player = accounts.player
				raffle = await ethers.getContract("Raffle", deployer)
				raffleEntranceFee = await raffle.getEntranceFee()
			})

			describe("fulfillRandomWords", () => {
				it("Works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
					const startingTimeStamp = await raffle.getLatestTimeStamp()
					const accounts = await ethers.getSigners()
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await new Promise(async (resolve, reject) => {
						raffle.once("WinnerPicked", async () => {
							try {
								const recentWinner =
									await raffle.getRecentWinner()
								const raffleState =
									await raffle.getRaffleState()
								const winnerEndingBalance =
									await accounts[0].getBalance()
								const endingTimeStamp =
									await raffle.getLatestTimeStamp()

								await expect(raffle.getPlayer(0)).to.be.reverted
								assert.equal(
									recentWinner.toString(),
									accounts[0].address
								)
								assert.equal(raffleState, "0")
								assert.equal(
									winnerEndingBalance.toString(),
									winnerStartingBalance
										.add(raffleEntranceFee)
										.sub(raffleStartingBalance.div(10))
										.toString()
								)
								assert(endingTimeStamp > startingTimeStamp)

								resolve()
							} catch (e) {
								console.log(e)
								reject(e)
							}

							await raffle.enterRaffle({
								value: raffleEntranceFee,
							})
							const raffleStartingBalance =
								await raffle.getBalance()
							const winnerStartingBalance =
								await accounts[0].getBalance()
						})
					})
				})
			})
	  })
