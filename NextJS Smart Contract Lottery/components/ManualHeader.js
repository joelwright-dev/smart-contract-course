import { useMoralis } from "react-moralis"
import { Button, Card, Avatar, Text, Group, ActionIcon } from "@mantine/core"
import { useEffect, useState } from "react"
import { useEvmNativeBalance } from "@moralisweb3/next"
import { Trash } from "tabler-icons-react"
const Moralis = require("moralis").default

const ManualHeader = () => {
	const [nativeBalance, setNativeBalance] = useState("")

	const {
		enableWeb3,
		account,
		isWeb3Enabled,
		deactivateWeb3,
		Moralis: Moralis2,
		isWeb3EnableLoading,
		isInitialized,
	} = useMoralis()

	async function getBalance() {
		setNativeBalance(
			await Moralis.EvmApi.balance.getNativeBalance({
				address: account,
				chain: "0x5",
			}).data
		)
	}

	if (account !== null) {
		getBalance()
	}

	useEffect(() => {
		if (isWeb3Enabled) return
		if (typeof window !== "undefined") {
			if (window.localStorage.getItem("connected")) {
				enableWeb3()
			}
		}
	}, [isWeb3Enabled])

	useEffect(() => {
		Moralis2.onAccountChanged((account) => {
			console.log(`Account changed to ${account}`)
			if (account == null) {
				window.localStorage.removeItem("connected")
				deactivateWeb3()
				console.log("Null account found")
			}
		})
	}, [])

	return (
		<div>
			{account ? (
				<Card
					shadow="sm"
					radius="lg"
					style={{
						height: "40px",
						padding: "5px",
						paddingRight: "20px",
					}}
					withBorder
				>
					<Group>
						<Card
							radius="lg"
							style={{
								height: "28px",
								padding: "2px",
								paddingLeft: "20px",
								paddingRight: "20px",
								backgroundColor: "#f9f9f9",
							}}
							withBorder
						>
							<Text>
								{account.slice(0, 6)}...
								{account.slice(account.length - 4)}
							</Text>
						</Card>
						{/* <Text>
							{typeof nativeBalance !== "undefined" ? (
								nativeBalance?.balance.ether
							) : (
								<></>
							)}
						</Text> */}
						<ActionIcon>
							<Trash />
						</ActionIcon>
					</Group>
				</Card>
			) : (
				<Button
					onClick={async () => {
						await enableWeb3()

						if (typeof window !== "undefined") {
							window.localStorage.setItem("connected", "injected")
						}
					}}
					loading={isWeb3EnableLoading}
				>
					Connect
				</Button>
			)}
		</div>
	)
}

export default ManualHeader
