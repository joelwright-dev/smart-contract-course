import { ethers } from "./ethers.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

window.onload = () => {
	getBalance()
}

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

async function getBalance() {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const balance = await provider.getBalance(contractAddress)
		document.getElementById("balance").value =
			ethers.utils.formatEther(balance)
	}
}

async function fund() {
	const ethAmount = document.getElementById("ethAmount").value
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
			console.log("Done!")
		} catch (error) {
			console.log(error)
		}
	}
	getBalance()
}

async function withdraw() {
	if (typeof window.ethereum !== "undefined") {
		console.log("Withdrawing...")
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, abi, signer)
		try {
			const transactionResponse = await contract.withdraw()
			await listenForTransactionMined(transactionResponse, provider)
		} catch (error) {
			console.log(error)
		}
	}
	getBalance()
}

function listenForTransactionMined(transactionResponse, provider) {
	console.log(`Mining ${transactionResponse.hash}...`)
	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(
				`Completed with ${transactionReceipt.confirmations} confirmations`
			)
			resolve()
		})
	})
}
