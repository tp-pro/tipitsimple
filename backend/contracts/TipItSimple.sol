// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TipItSimple {
    //évènement pour envoyer un remerciement
    event NewTip(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //struct d'un remerciement
    struct Tip {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //liste des remerciements
    Tip[] tips;

    //address de déploiement du contrat
    address payable immutable owner;

    //constructor pour la logique de déploiement
    //peut reçevoir des paiements
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev function tip pour le propriétaire du contrat
     * @param _name nom du tippeur
     * @param _message message du tippeur
     */
    function tip(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "can't tip with 0 eth");

        //ajout du tip au storage
        tips.push(Tip(msg.sender, block.timestamp, _name, _message));

        //emit un log event lorsqu'un nouveau tip est créé
        emit NewTip(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev function de retrait pour récupération des fonds par le propriétaire du contrat
     */
    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw");
        owner.transfer(address(this).balance);
    }

    /**
     * @dev function pour récupérer l'ensemble des messages reçus et stockés depuis la blockchain
     */
    function getTips() public view returns (Tip[] memory) {
        return tips;
    }
}
