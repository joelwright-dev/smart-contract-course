// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

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
	address[] public s_funders;
	mapping(address => uint256) private s_addressToAmountFunded;
	address private immutable i_owner;
	AggregatorV3Interface private s_priceFeed;

	modifier onlyOwner() {
		if (msg.sender != i_owner) {
			revert FundMe__NotOwner();
		}
		_;
	}

	constructor(address priceFeedAddress) {
		i_owner = msg.sender;
		s_priceFeed = AggregatorV3Interface(priceFeedAddress);
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
		if (msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) {
			revert FundMe__LowInput();
		}
		s_funders.push(msg.sender);
		s_addressToAmountFunded[msg.sender] += msg.value;
	}

	/**
	 * @notice This function withdraws the funds from the contract into the owner wallet
	 */
	function withdraw() public onlyOwner {
		for (
			uint256 funderIndex = 0;
			funderIndex < s_funders.length;
			funderIndex++
		) {
			address funder = s_funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}

		s_funders = new address[](0);

		(bool callSuccess, ) = payable(msg.sender).call{
			value: address(this).balance
		}("");
		if (!callSuccess) {
			revert FundMe__CallFail();
		}
	}

	function cheaperWithdraw() public onlyOwner {
		address[] memory funders = s_funders;
		for (
			uint256 funderIndex = 0;
			funderIndex < funders.length;
			funderIndex++
		) {
			address funder = funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}
		s_funders = new address[](0);
		(bool success, ) = i_owner.call{value: address(this).balance}("");
		require(success);
	}

	function getAddressToAmountFunded(address fundingAddress)
		public
		view
		returns (uint256)
	{
		return s_addressToAmountFunded[fundingAddress];
	}

	function getPriceFeed() public view returns (AggregatorV3Interface) {
		return s_priceFeed;
	}

	function getOwner() public view returns (address) {
		return i_owner;
	}
}
