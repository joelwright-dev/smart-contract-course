const { run } = require("hardhat")

const verify = async (contactAddress, args) => {
	console.log("Verifying contact...")
	try {
		await run("verify:verify", {
			address: contactAddress,
			constructorArguments: args,
		})
	} catch (e) {
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("Contact already verified")
		} else {
			console.log(e)
		}
	}
}

module.exports = { verify }
