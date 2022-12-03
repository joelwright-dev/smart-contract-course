const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {
	developmentChains,
	networkConfig,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Raffle Unit Tests", () => {
			let raffle,
				vrfCoordinatorV2Mock,
				raffleEntranceFee,
				deployer,
				interval,
				player
			const chainId = network.config.chainId

			beforeEach(async () => {
				const accounts = await getNamedAccounts()
				deployer = accounts.deployer
				player = accounts.player
				await deployments.fixture(["all"])
				raffle = await ethers.getContract("Raffle", deployer)
				vrfCoordinatorV2Mock = await ethers.getContract(
					"VRFCoordinatorV2Mock",
					deployer
				)
				raffleEntranceFee = await raffle.getEntranceFee()
				interval = await raffle.getInterval()
			})

			describe("constructor", () => {
				it("Initializes the raffle correctly", async () => {
					const raffleState = await raffle.getRaffleState()
					assert.equal(raffleState.toString(), "0")
					assert.equal(
						interval.toString(),
						networkConfig[chainId]["interval"]
					)
				})
			})

			describe("enterRaffle", () => {
				it("Reverts when you don't pay enough ETH", async () => {
					await expect(raffle.enterRaffle()).to.be.revertedWith(
						"Raffle__NotEnoughETHEntered"
					)
				})

				it("Records players when they enter", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					const playerFromContract = await raffle.getPlayer(0)
					assert.equal(playerFromContract, deployer)
				})

				it("Emits event on enter", async () => {
					await expect(
						raffle.enterRaffle({ value: raffleEntranceFee })
					).to.emit(raffle, "RaffleEnter")
				})

				it("Doesn't allow entrance when raffle is calculating", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])

					await raffle.performUpkeep([])
					await expect(
						raffle.enterRaffle({ value: raffleEntranceFee })
					).to.be.revertedWith("Raffle__NotOpen")
				})
			})

			describe("checkUpkeep", () => {
				it("Returns false if people haven't sent any ETH", async () => {
					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])
					const { upkeepNeeded } =
						await raffle.callStatic.checkUpkeep([])
					assert(!upkeepNeeded)
				})

				it("Returns false if raffle isn't open", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])
					await raffle.performUpkeep([])
					const raffleState = await raffle.getRaffleState()
					const { upkeepNeeded } =
						await raffle.callStatic.checkUpkeep([])
					assert.equal(raffleState.toString(), "1")
					assert.equal(upkeepNeeded, false)
				})

				it("Returns false if enough time hasn't passed", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() - 10,
					])
					await network.provider.send("evm_mine", [])
					const { upkeepNeeded } =
						await raffle.callStatic.checkUpkeep([])
					assert(!upkeepNeeded)
				})

				it("Returns true if enough time has passed, has players, ETH, and is open", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])
					const { upkeepNeeded } =
						await raffle.callStatic.checkUpkeep([])
					assert(upkeepNeeded)
				})
			})

			describe("performUpkeep", () => {
				it("Can only run when checkUpkeep is true", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])

					const tx = await raffle.performUpkeep([])
					assert(tx)
				})

				it("Reverts when checkUpkeep is false", async () => {
					await expect(raffle.performUpkeep([])).to.be.revertedWith(
						"Raffle__UpkeepNotNeeded"
					)
				})

				it("Updates the raffle state, emits an event, and calls the VRF Coordinator", async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })
					secondPlayer = await ethers.getContract("Raffle", player)
					await secondPlayer.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])

					const txResponse = await raffle.performUpkeep([])
					const txReceipt = await txResponse.wait(1)
					const requestId = txReceipt.events[1].args.requestId
					const raffleState = await raffle.getRaffleState()
					assert(requestId.toNumber() > 0)
					assert(raffleState.toString() == "1")
				})
			})

			describe("fulfillRandomWords", () => {
				beforeEach(async () => {
					await raffle.enterRaffle({ value: raffleEntranceFee })

					await network.provider.send("evm_increaseTime", [
						interval.toNumber() + 1,
					])
					await network.provider.send("evm_mine", [])
				})

				it("Can only be called after performUpkeep", async () => {
					await expect(
						vrfCoordinatorV2Mock.fulfillRandomWords(
							0,
							raffle.address
						)
					).to.be.revertedWith("nonexistent request")
					await expect(
						vrfCoordinatorV2Mock.fulfillRandomWords(
							1,
							raffle.address
						)
					).to.be.revertedWith("nonexistent request")
				})

				it("Picks a winner, resets the lottery, and sends money", async () => {
					const additionalEntrants = 3
					const startingAccountIndex = 1
					const accounts = await ethers.getSigners()
					for (
						let i = startingAccountIndex;
						i < startingAccountIndex + additionalEntrants;
						i++
					) {
						const accountConnectedRaffle = raffle.connect(
							accounts[i]
						)
						await accountConnectedRaffle.enterRaffle({
							value: raffleEntranceFee,
						})
					}

					const startingTimeStamp = await raffle.getLatestTimeStamp()
					await new Promise(async (resolve, reject) => {
						raffle.once("WinnerPicked", async () => {
							try {
								const recentWinner =
									await raffle.getRecentWinner()
								const raffleState =
									await raffle.getRaffleState()
								const winnerEndingBalance =
									await accounts[1].getBalance()
								const endingTimeStamp =
									await raffle.getLatestTimeStamp()
								const numPlayers =
									await raffle.getNumberOfPlayers()
								assert.equal(numPlayers.toString(), "0")
								assert.equal(raffleState.toString(), "0")
								assert(endingTimeStamp > startingTimeStamp)
								assert.equal(
									winnerEndingBalance.toString(),
									winnerStartingBalance
										.add(
											raffleEntranceFee
												.mul(additionalEntrants)
												.add(raffleEntranceFee)
										)
										.sub(raffleStartingBalance.div(10))
										.toString()
								)
							} catch (e) {
								reject(e)
							}
							resolve()
						})

						const tx = await raffle.performUpkeep([])
						const txReceipt = await tx.wait(1)
						const winnerStartingBalance =
							await accounts[1].getBalance()
						const raffleStartingBalance = await raffle.getBalance()
						await vrfCoordinatorV2Mock.fulfillRandomWords(
							txReceipt.events[1].args.requestId,
							raffle.address
						)
					})
				})
			})
	  })
