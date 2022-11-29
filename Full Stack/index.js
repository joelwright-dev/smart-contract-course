import { ethers } from "./ethers.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")

connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
	if (typeof window.ethereum !== "undefined") {
		window.ethereum
			.request({ method: "eth_requestAccounts" })
			.then((connectButton.innerHTML = "Connected to MetaMask!"))
			.catch((error) => {
				connectButton.innerHTML = "Connection Rejected!"
			})
	} else {
		connectButton.innerHTML = "Please install MetaMask!"
	}
}

async function fund() {
	const ethAmount = "7"
	console.log(`Funding with ${ethAmount}...`)
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, abi, signer)

		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			})
			await listenForTransactionMined(transactionResponse, provider)
		} catch (error) {
			console.log(error)
		}
	}
}

function listenForTransactionMined(transactionResponse, provider) {
	console.log(`Mining ${transactionResponse.hash}...`)
	return new Promise()
}
