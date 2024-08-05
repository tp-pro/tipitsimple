const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("FriendManager test", function () {
    async function deployFixture() {
        console.log("Starting deployment...");
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
        console.log("Signers obtained");

        const FriendManager = await ethers.getContractFactory("FriendManager");
        console.log("Contract factory created");

        const friendManager = await FriendManager.deploy();
        console.log("Contract deployment initiated");

        await friendManager.waitForDeployment();
        console.log("Contract deployment completed");

        console.log("Contract address:", await friendManager.getAddress());
        console.log("Owner address:", owner.address);
        console.log("Other account address:", otherAccount.address);

        return { friendManager, owner, otherAccount, thirdAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { friendManager, owner } = await loadFixture(deployFixture);
            expect(await friendManager.friendManagerOwner()).to.equal(owner.address);
        });
    });

    describe("addFriend function", function () {
        it("Should allow adding a new friend with a name", async function () {
            const { friendManager, owner, otherAccount } = await loadFixture(deployFixture);
            const friendName = "John Doe";
            await expect(friendManager.connect(owner).addFriend(otherAccount.address, friendName))
                .to.emit(friendManager, "FriendAdded")
                .withArgs(owner.address, otherAccount.address, friendName);
            
            const isNowFriend = await friendManager.checkIsFriend(owner.address, otherAccount.address);
            expect(isNowFriend).to.be.true;
        });

        it("Should fail to add oneself as a friend", async function () {
            const { friendManager, owner } = await loadFixture(deployFixture);
            await expect(friendManager.connect(owner).addFriend(owner.address, "Myself"))
                .to.be.revertedWith("Cannot add yourself as a friend");
        });

        it("Should fail to add the same friend twice", async function () {
            const { friendManager, owner, otherAccount } = await loadFixture(deployFixture);
            const friendName = "John Doe";
            await friendManager.connect(owner).addFriend(otherAccount.address, friendName);
            await expect(friendManager.connect(owner).addFriend(otherAccount.address, friendName))
                .to.be.revertedWith("Already a friend");
        });

        it("Should fail when non-owner tries to add a friend", async function () {
            const { friendManager, otherAccount, thirdAccount } = await loadFixture(deployFixture);
            await expect(friendManager.connect(otherAccount).addFriend(thirdAccount.address, "Alice"))
                .to.be.revertedWith("Only owner can perform this action");
        });
    });

    describe("removeFriend function", function () {
        it("Should allow removing a friend", async function () {
            const { friendManager, owner, otherAccount } = await loadFixture(deployFixture);
            await friendManager.connect(owner).addFriend(otherAccount.address, "John");
            await friendManager.connect(owner).removeFriend(otherAccount.address);
            const isStillFriend = await friendManager.checkIsFriend(owner.address, otherAccount.address);
            expect(isStillFriend).to.be.false;
        });

        it("Should fail when trying to remove a non-friend", async function () {
            const { friendManager, owner, otherAccount } = await loadFixture(deployFixture);
            await expect(friendManager.connect(owner).removeFriend(otherAccount.address))
                .to.be.revertedWith("Not a friend");
        });
    });

    describe("getFriends function", function () {
        it("Should return the correct list of friends", async function () {
            const { friendManager, owner, otherAccount, thirdAccount } = await loadFixture(deployFixture);
            await friendManager.connect(owner).addFriend(otherAccount.address, "John");
            await friendManager.connect(owner).addFriend(thirdAccount.address, "Alice");
            
            const friends = await friendManager.connect(owner).getFriends();
            expect(friends.length).to.equal(2);
            expect(friends[0].addr).to.equal(otherAccount.address);
            expect(friends[0].name).to.equal("John");
            expect(friends[1].addr).to.equal(thirdAccount.address);
            expect(friends[1].name).to.equal("Alice");
        });
    });

    describe("checkIsFriend function", function () {
        it("Should correctly identify friends and non-friends", async function () {
            const { friendManager, owner, otherAccount, thirdAccount } = await loadFixture(deployFixture);
            await friendManager.connect(owner).addFriend(otherAccount.address, "John");
            
            expect(await friendManager.checkIsFriend(owner.address, otherAccount.address)).to.be.true;
            expect(await friendManager.checkIsFriend(owner.address, thirdAccount.address)).to.be.false;
        });
    });
});