import { useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"

export default function LotterEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
	const chainId = parseInt(chainIdHex)
	const raffleAddress =
		chainId in contractAddresses ? contractAddresses[chainId][0] : null

	// const { runContractFunction: enterRaffle } = useWeb3Contract({
	//     abi: abi,
	//     contractAddress: raffleAddress,
	//     functionName: "enterRaffle",
	//     params: {},
	//     msgValue: //
	// })

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	})

	useEffect(() => {
		if (isWeb3Enabled) {
			async function updateUI() {
				const entranceFee = await getEntranceFee()
				console.log(entranceFee)
			}
			updateUI()
		}
	}, [isWeb3Enabled])

	return <div>Lottery Entrance</div>
}
