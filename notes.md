# Best Practices
- Look at code samples
- Check the course repository if you have issues
- Take breaks
- Use collaborative tools:
    - Stack overflow
    - Discord
    - Reddit
    - GitHub discussion tab
- Connect with hackathons to grow your network

# Blockchain basics
- Decentralized currency
- Decentralized agreements (smart contracts)
    - A set of instructions executed decentrally without the need for a centralized or third party intermediary
- Blockchains are intentionally walled off from old systems which don't occur on the blockchain
    - We can use blockchain oracles to interact with the off-chain world to provide external data or computation to smart contracts
- Hybrid smart contracts
    - On-chain and off-chain agreements
    - Chainlink
- DAPPs are the combination of many smart contracts
- Smart contracts create unbreakable agreements and promises

# The purpose of smart contracts
- Anything that can be done with an agreement should be done with smart contracts
- You CANNOT break a promise made through smart contract
- Smart contracts:
    - Cannot be altered (immutable)
    - Automatically execute
    - Are transparent

# Other benefits of blockchain
- Smart contracts have their own value

# What have smart contracts been used for?
- DeFi (Decentralized Finance)
- DAOs (Groups completely governed by smart contracts on the blockchain)
- NFTs (Unique assets)

# What is gas?
- Nodes get paid for computing transactions in the form of fees
- Gas is a unit of computational measurement. The more complex your transaction is, the more gas you have to pay.
- Transaction fee (gas paid) is equal to the current gas price multiplied by the gas used by the transaction.
- Gwei and Wei are commonly used to refer to extremely small amounts of Ether, practically only used when regarding gas fees.
- The base gas fee gets burnt and the remaining gas is paid to miners 

# What are blocks on the blockchain?
- Blocks have a block number, a nonce, data and a hash
- Nonces are found by miners mining blocks which alter the hash to meet certain conditions, such as having 4 zeros at the start
- On a blockchain, blocks also store the hash of the previous block in the blockchain
- The first block on a blockchain is the genesis block

# Signing transactions
- Private keys are used to create public keys and are linked as a "key pair"
- Private keys are used to sign transactions on the blockchain
- Signatures can be verified using just the public key

# Consensus
- The mechanism used to agree on the state of a blockchain
- Chain selection
- Sybil resistance (Proof of work) is a way to defend against one person making a tonne of blocks on their own and reeping the rewards
- Nakamoto consensus: whichever chain has the most blocks is the correct blockchain
- Block confirmations is the number of additional blocks added to the block chain after that block was created and mined.
- Proof of work gets paid in a block reward, given by the blockchain itself
- Gas fees are paid by whoever creates the transaction
- Proof of stake involves validators which can have collatoral if they don't follow the rules

# Blockchain attacks
- Sybil attacks are when a user creates a lot of pseudo anonymous accounts to influence a network (very difficult)
- 51% attacks are when an attacker controls 51% of the network and can force the chain to fork

# Layers
- Layer 1
    - Base layer blockchain implementation
    - Ethereum
    - Bitcoin
- Layer 2
    - Any application built on top of a layer 1 implementation
    - Chainlink