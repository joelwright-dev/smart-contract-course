import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { Title, Text, Button, Group, Stack } from "@mantine/core"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotterEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
	const chainId = parseInt(chainIdHex)
	const raffleAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null
	const [entranceFee, setEntranceFee] = useState("0")
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

	useEffect(() => {
		if (isWeb3Enabled) {
			async function updateUI() {
				const contractEntranceFee = (await getEntranceFee()).toString()
				setEntranceFee(contractEntranceFee)
			}
			updateUI()
		}
	}, [isWeb3Enabled])

	const handleSuccess = async function (tx) {
		await tx.wait(1)
		handleNewNotification(tx)
	}

	const handleNewNotification = function () {
		dispatch({
			type: "info",
			message: "Transaction Complete!",
			title: "Tx Notification",
			position: "topR",
			icon: "bell",
		})
	}

	return (
		<div>
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
							gradient={{ from: "indigo", to: "cyan", deg: 45 }}
						>
							{ethers.utils.formatUnits(entranceFee, "ether")}
							ETH
						</Text>
					</Text>
					<Button
						onClick={async () => {
							await enterRaffle({
								onSuccess: handleSuccess(),
								onError: (error) => console.log(error),
							})
						}}
					>
						Enter Raffle
					</Button>
				</Stack>
			) : (
				<Text ta="center">No raffle address detected!</Text>
			)}
		</div>
	)
}
