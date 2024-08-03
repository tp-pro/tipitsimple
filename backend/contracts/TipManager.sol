// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "./FriendManager.sol";

contract TipManager {
    address payable public tipManagerOwner; // Renommé pour éviter les conflits
    FriendManager private friendManager;

    struct Tip {
        address from;
        address to;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    Tip[] public tips;
    uint256 public totalCommission;
    uint256 public commissionRate = 5;

    event NewTip(
        address indexed from,
        address to,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    event CommissionRateChanged(uint256 newRate);

    modifier onlyOwner() virtual {
        require(
            msg.sender == tipManagerOwner,
            "Only owner can perform this action"
        );
        _;
    }

    constructor(FriendManager _friendManager) {
        tipManagerOwner = payable(msg.sender);
        friendManager = _friendManager;
    }

    function setCommissionRate(uint256 _rate) public onlyOwner {
        commissionRate = _rate;
        emit CommissionRateChanged(_rate);
    }

    function tip(
        string memory _name,
        string memory _message,
        uint256 _to,
        bool _isIndex
    ) public payable {
        require(msg.value > 0, "can't tip with 0 eth");

        address payable recipient;
        if (_isIndex) {
            FriendManager.Friend[] memory userFriends = friendManager
                .getFriends();
            require(_to < userFriends.length, "Invalid friend index");
            recipient = payable(userFriends[_to].addr);
        } else {
            recipient = payable(address(uint160(_to)));
        }

        require(recipient != address(0), "Cannot send to zero address");
        require(
            recipient != address(this),
            "Cannot tip to the contract itself"
        );

        uint256 commission = (msg.value * commissionRate) / 100;
        uint256 amountToSend = msg.value - commission;
        totalCommission += commission;

        tips.push(
            Tip(
                msg.sender,
                recipient,
                block.timestamp,
                _name,
                _message,
                msg.value
            )
        );

        emit NewTip(
            msg.sender,
            recipient,
            block.timestamp,
            _name,
            _message,
            msg.value
        );

        recipient.transfer(amountToSend);
    }

    function withdrawTips() public onlyOwner {
        uint256 amount = totalCommission;
        totalCommission = 0;

        tipManagerOwner.transfer(amount);
    }

    function getTips() public view returns (Tip[] memory) {
        return tips;
    }
}
