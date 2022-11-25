// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17; // Carat indicates this smart contract can be executed with higher versions of solidity

contract SimpleStorage {
    uint256 favoriteNumber;
    
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    // view or pure transactions do not create transactions
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
    }
}