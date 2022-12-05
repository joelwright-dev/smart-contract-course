import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import {
	Title,
	Text,
	Button,
	Group,
	Stack,
	ThemeIcon,
	Center,
} from "@mantine/core"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { Bell } from "tabler-icons-react"
import VerticalCarousel from "../components/Carousel"
const crypto = require("crypto")

export default function LotterEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
	const chainId = parseInt(chainIdHex)
	const raffleAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null
	const [entranceFee, setEntranceFee] = useState("0")
	const [numPlayers, setNumPlayers] = useState("0")
	const [recentWinner, setRecentWinner] = useState("0")
	const [fakeAddress1, setFakeAddress1] = useState("0")
	const [fakeAddress2, setFakeAddress2] = useState("0")
	const [loadingEnter, setLoadingEnter] = useState(false)
	const dispatch = useNotification()

	const { runContractFunction: enterRaffle } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee, //
	})

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	})

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	})

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getRecentWinner",
		params: {},
	})

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString()
		const numPlayersFromCall = (await getNumberOfPlayers()).toString()
		const recentWinnerFromCall = await getRecentWinner()
		setEntranceFee(entranceFeeFromCall)
		setNumPlayers(numPlayersFromCall)
		setRecentWinner(recentWinnerFromCall)
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI()
		}
	}, [isWeb3Enabled])

	const handleSuccess = async function (tx) {
		await tx.wait(1)
		handleNewNotification(tx)
		updateUI()
		setLoadingEnter(false)
	}

	const handleNewNotification = function () {
		dispatch({
			type: "info",
			message: "Transaction Complete!",
			title: "Tx Notification",
			position: "bottomR",
			icon: (
				<ThemeIcon variant="light">
					<Bell />
				</ThemeIcon>
			),
		})
	}

	function generateFakeAddresses() {
		const id = crypto.randomBytes(32).toString("hex")
		var privateKey = "0x" + id

		const wallet = new ethers.Wallet(privateKey)
		return wallet.address
	}

	useEffect(() => {
		setFakeAddress1(generateFakeAddresses())
		setFakeAddress2(generateFakeAddresses())
	}, [])

	const data = {
		leadingText: "Recent Winner",
		slides: [
			{
				introline: recentWinner,
				id: "0",
			},
			{
				introline: fakeAddress1,
				id: "1",
			},
			{
				introline: fakeAddress2,
				id: "2",
			},
		],
	}

	return (
		<div>
			<Stack spacing="xl">
				<Title order={1} ta="center">
					Welcome to{" "}
					<Text
						span
						inherit
						variant="gradient"
						gradient={{ from: "indigo", to: "cyan", deg: 45 }}
					>
						ETH Raffle
					</Text>
				</Title>
				{raffleAddress ? (
					<Stack align="center">
						<Text ta="center">
							To enter, pay{" "}
							<Text
								span
								inherit
								variant="gradient"
								gradient={{
									from: "indigo",
									to: "cyan",
									deg: 45,
								}}
							>
								{ethers.utils.formatUnits(entranceFee, "ether")}
								ETH
							</Text>
						</Text>
						<Button
							onClick={async () => {
								setLoadingEnter(true)
								await enterRaffle({
									onSuccess: handleSuccess,
									onError: (error) => console.log(error),
								})
							}}
							loading={loadingEnter}
						>
							Enter Raffle
						</Button>
					</Stack>
				) : (
					<Text ta="center">No raffle address detected!</Text>
				)}
				<VerticalCarousel
					data={data.slides}
					leadingText={data.leadingText}
				/>
				<Text ta="center">
					<Text
						span
						inherit
						variant="gradient"
						gradient={{
							from: "indigo",
							to: "cyan",
							deg: 45,
						}}
					>
						{numPlayers}
					</Text>{" "}
					players entered.
				</Text>
			</Stack>
		</div>
	)
}
