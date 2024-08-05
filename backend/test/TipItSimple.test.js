const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("TipItSimple test", function () {
    async function deployFixture() {
        console.log("Starting deployment...");
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
        console.log("Signers obtained");

        // Deploy FriendManager first
        const FriendManager = await ethers.getContractFactory("FriendManager");
        const friendManager = await FriendManager.deploy();
        await friendManager.waitForDeployment();
        console.log("FriendManager deployed");

        const TipItSimple = await ethers.getContractFactory("TipItSimple");
        console.log("Contract factory created");

        const tipItSimple = await TipItSimple.deploy(await friendManager.getAddress());
        console.log("Contract deployment initiated");

        await tipItSimple.waitForDeployment();
        console.log("Contract deployment completed");

        console.log("Contract address:", await tipItSimple.getAddress());
        console.log("Owner address:", owner.address);
        console.log("Other account address:", otherAccount.address);

        return { tipItSimple, owner, otherAccount, thirdAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { tipItSimple, owner } = await loadFixture(deployFixture);
            const contractOwner = await tipItSimple.getOwner();
            expect(contractOwner).to.equal(owner.address);
        });
    });

    describe("FriendManager functionality", function () {
        it("Should allow adding a friend", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            await expect(tipItSimple.connect(owner).addFriend(otherAccount.address, "John"))
                .to.emit(tipItSimple, "FriendAdded")
                .withArgs(owner.address, otherAccount.address, "John");
        });

        it("Should allow removing a friend", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            await tipItSimple.connect(owner).addFriend(otherAccount.address, "John");
            await tipItSimple.connect(owner).removeFriend(otherAccount.address);
            expect(await tipItSimple.checkIsFriend(owner.address, otherAccount.address)).to.be.false;
        });
    });

    describe("TipManager functionality", function () {
        it("Should allow sending a tip", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            await expect(tipItSimple.connect(owner).tip("Test", "Test message", BigInt(otherAccount.address), false, { value: tipAmount }))
                .to.emit(tipItSimple, "NewTip")
                .withArgs(owner.address, otherAccount.address, anyValue, "Test", "Test message", tipAmount);
        });

        it("Should allow owner to withdraw tips", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            await tipItSimple.connect(otherAccount).tip("Test", "Test message", BigInt(owner.address), false, { value: tipAmount });
            
            await expect(tipItSimple.connect(owner).withdrawTips()).to.not.be.reverted;
        });
    });

    describe("TipItSimple specific functionality", function () {
        it("Should record transactions", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            
            await expect(tipItSimple.connect(owner).tip("Test", "Test message", BigInt(otherAccount.address), false, { value: tipAmount }))
                .to.emit(tipItSimple, "NewTip")
                .withArgs(owner.address, otherAccount.address, anyValue, "Test", "Test message", tipAmount);
        });
    });
});