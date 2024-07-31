// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TipItSimple {
    //évènement pour émettre un remerciement
    event NewTip(
        address indexed from,
        address to,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    //évènement pour émettre les détails de la transaction
    event TransactionDetails(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    //évènement pour émettre le changement du taux commission
    event CommissionRateChanged(uint256 newRate);

    //enregistrement des transactions dans le smart contract
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    //struct d'un remerciement
    struct Tip {
        address from;
        address to;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    //liste des transactions
    Transaction[] public transactions;

    //liste des remerciements
    Tip[] public tips;

    //address de déploiement du contrat
    address payable immutable owner;

    // Montant total des commissions accumulées
    uint256 public totalCommission;

    // Taux de commission de 5%
    uint256 public commissionRate = 5;

    //constructor pour la logique de déploiement
    //peut reçevoir des paiements
    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    /**
     * @dev function setCommissionRate pour établir la commission sur chaque transaction
     * @param _rate taux commission
     */
    function setCommissionRate(uint256 _rate) public onlyOwner {
        commissionRate = _rate;
        emit CommissionRateChanged(_rate);
    }

    /**
     * @dev function recordTransaction pour établir la sauvegarde des transactions
     * @param _to adresse destinatrice
     * @param _amount montant de la transaction
     */
    function recordTransaction(address _to, uint256 _amount) internal {
        transactions.push(
            Transaction(msg.sender, _to, _amount, block.timestamp)
        );
        emit TransactionDetails(msg.sender, _to, _amount, block.timestamp);
    }

    /**
     * @dev function tip pour le propriétaire du contrat
     * @param _name nom du tippeur
     * @param _message message du tippeur
     */
    function tip(
        string memory _name,
        string memory _message,
        address payable _to
    ) public payable {
        require(msg.value > 0, "can't tip with 0 eth");
        require(_to != address(0), "Cannot send to zero address");

        uint256 commission = (msg.value * commissionRate) / 100;
        uint256 amountToSend = msg.value - commission;
        totalCommission += commission;

        //ajout du tip au storage
        tips.push(
            Tip(msg.sender, _to, block.timestamp, _name, _message, msg.value)
        );

        //emit un log event lorsqu'un nouveau tip est créé
        emit NewTip(
            msg.sender,
            _to,
            block.timestamp,
            _name,
            _message,
            msg.value
        );

        // Transférer les ETH directement à l'adresse spécifiée
        _to.transfer(amountToSend);
    }

    /**
     * @dev function de retrait pour récupération des fonds par le propriétaire du contrat
     */
    function withdrawTips() public onlyOwner {
        uint256 amount = totalCommission;
        totalCommission = 0;

        owner.transfer(amount);
    }

    /**
     * @dev function pour récupérer l'adresse du propriétaire
     */
    function getOwner() public view returns (address) {
        return owner;
    }

    /**
     * @dev function pour récupérer l'ensemble des messages reçus et stockés depuis la blockchain
     */
    function getTips() public view returns (Tip[] memory) {
        return tips;
    }
}
