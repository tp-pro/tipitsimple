// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TipItSimple {
    //mapping pour stocker les amis de chaque utilisateur
    mapping(address => Friend[]) private friends;

    //mapping pour vérifier rapidement si une adresse est un ami
    mapping(address => mapping(address => bool)) private isFriend;

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

    //évènement pour émettre l'ajout d'un nouvel ami
    event FriendAdded(
        address indexed owner,
        address indexed friendAddress,
        string friendName
    );

    //enregistrement des amis dans le smart contract
    struct Friend {
        address addr;
        string name;
    }

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
        uint256 _to,
        bool _isIndex
    ) public payable {
        require(msg.value > 0, "can't tip with 0 eth");

        address payable recipient;
        if (_isIndex) {
            require(_to < friends[msg.sender].length, "Invalid friend index");
            recipient = payable(friends[msg.sender][_to].addr);
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

        //ajout du tip au storage
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

        //emit un log event lorsqu'un nouveau tip est créé
        emit NewTip(
            msg.sender,
            recipient,
            block.timestamp,
            _name,
            _message,
            msg.value
        );

        // Transférer les ETH directement à l'adresse spécifiée
        recipient.transfer(amountToSend);
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

    /**
     * @dev Fonction pour ajouter un ami, restreinte au propriétaire du contrat
     * @param _friend Adresse de l'ami à ajouter
     */
    function addFriend(address _friend, string memory _name) public onlyOwner {
        require(_friend != msg.sender, "Cannot add yourself as a friend");
        require(
            _friend != address(this),
            "Cannot add the contract as a friend"
        );
        require(!isFriend[owner][_friend], "Already a friend");

        Friend memory newFriend = Friend({addr: _friend, name: _name});

        friends[owner].push(newFriend);
        isFriend[owner][_friend] = true;

        emit FriendAdded(msg.sender, _friend, _name);
    }

    /**
     * @dev Fonction pour supprimer un ami
     * @param _friend Adresse de l'ami à supprimer
     */
    function removeFriend(address _friend) public {
        require(
            _friend != address(this),
            "Cannot remove the contract as a friend"
        );
        require(isFriend[msg.sender][_friend], "Not a friend");

        for (uint256 i = 0; i < friends[msg.sender].length; i++) {
            if (friends[msg.sender][i].addr == _friend) {
                friends[msg.sender][i] = friends[msg.sender][
                    friends[msg.sender].length - 1
                ];
                friends[msg.sender].pop();
                break;
            }
        }

        isFriend[msg.sender][_friend] = false;
    }

    /**
     * @dev Fonction pour récupérer la liste des amis d'un utilisateur
     * @return Un tableau d'adresses représentant les amis de l'utilisateur
     */
    function getFriends() public view returns (address[] memory) {
        Friend[] storage myFriends = friends[msg.sender];
        address[] memory friendAddresses = new address[](myFriends.length);
        for (uint256 i = 0; i < myFriends.length; i++) {
            friendAddresses[i] = myFriends[i].addr;
        }
        return friendAddresses;
    }

    /**
     * @dev Fonction pour définir si une adresse est un ami
     * @return Un tableau d'adresses représentant les amis de l'utilisateur
     */
    function checkIsFriend(address _owner, address friendAddress)
        public
        view
        returns (bool)
    {
        return isFriend[_owner][friendAddress];
    }
}
