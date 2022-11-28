// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error FundMe__NotOwner();
error FundMe__CallFail();
error FundMe__LowInput();

/**
 * @title A contract for crowd funding
 * @author Joel Wright
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */

contract FundMe {
	using PriceConverter for uint256;

	uint256 public constant MINIMUM_USD = 50 * 1e18;
	address[] public funders;
	mapping(address => uint256) public addressToAmountFunded;
	address public immutable i_owner;
	AggregatorV3Interface private priceFeed;

	modifier onlyOwner() {
		if (msg.sender != i_owner) {
			revert FundMe__NotOwner();
		}
		_;
	}

	constructor(address priceFeedAddress) {
		i_owner = msg.sender;
		priceFeed = AggregatorV3Interface(priceFeedAddress);
	}

	receive() external payable {
		fund();
	}

	fallback() external payable {
		fund();
	}

	/**
	 * @notice This function funds this contract
	 */
	function fund() public payable {
		if (msg.value.getConversionRate(priceFeed) < MINIMUM_USD) {
			revert FundMe__LowInput();
		}
		funders.push(msg.sender);
		addressToAmountFunded[msg.sender] += msg.value;
	}

	/**
	 * @notice This function withdraws the funds from the contract into the owner wallet
	 */
	function withdraw() public onlyOwner {
		for (
			uint256 funderIndex = 0;
			funderIndex < funders.length;
			funderIndex++
		) {
			address funder = funders[funderIndex];
			addressToAmountFunded[funder] = 0;
		}

		funders = new address[](0);

		(bool callSuccess, ) = payable(msg.sender).call{
			value: address(this).balance
		}("");
		if (!callSuccess) {
			revert FundMe__CallFail();
		}
	}

	function getAddressToAmountFunded(address fundingAddress)
		public
		view
		returns (uint256)
	{
		return addressToAmountFunded[fundingAddress];
	}

	function getPriceFeed() public view returns (AggregatorV3Interface) {
		return priceFeed;
	}
}
