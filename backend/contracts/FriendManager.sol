// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract FriendManager {
    address payable public friendManagerOwner; // Renommé pour éviter les conflits

    //mapping pour stocker les amis de chaque utilisateur
    mapping(address => Friend[]) private friends;

    //mapping pour vérifier rapidement si une adresse est un ami
    mapping(address => mapping(address => bool)) private isFriend;

    //enregistrement des amis dans le smart contract
    struct Friend {
        address addr;
        string name;
    }

    //évènement pour émettre l'ajout d'un nouvel ami
    event FriendAdded(
        address indexed owner,
        address indexed friendAddress,
        string friendName
    );

    modifier onlyOwner() virtual {
        require(
            msg.sender == friendManagerOwner,
            "Only owner can perform this action"
        );
        _;
    }

    constructor() {
        friendManagerOwner = payable(msg.sender); // Initialisation correcte
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
        require(!isFriend[friendManagerOwner][_friend], "Already a friend");

        Friend memory newFriend = Friend({addr: _friend, name: _name});

        friends[friendManagerOwner].push(newFriend);
        isFriend[friendManagerOwner][_friend] = true;

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
    function getFriends() public view returns (Friend[] memory) {
        return friends[msg.sender];
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
