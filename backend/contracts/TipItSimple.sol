// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "./FriendManager.sol";
import "./TipManager.sol";

contract TipItSimple is FriendManager, TipManager {
    event TransactionDetails(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    Transaction[] public transactions;
    address payable immutable owner;

    constructor(FriendManager _friendManager) TipManager(_friendManager) {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() override(FriendManager, TipManager) {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function recordTransaction(address _to, uint256 _amount) internal {
        transactions.push(
            Transaction(msg.sender, _to, _amount, block.timestamp)
        );
        emit TransactionDetails(msg.sender, _to, _amount, block.timestamp);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
