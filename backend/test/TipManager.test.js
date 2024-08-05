const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("TipManager test", function () {
    async function deployFixture() {
        console.log("Starting deployment...");
        const [owner, otherAccount] = await ethers.getSigners();
        console.log("Signers obtained");

        // Déployer d'abord FriendManager
        const FriendManager = await ethers.getContractFactory("FriendManager");
        const friendManager = await FriendManager.deploy();
        await friendManager.waitForDeployment();
        console.log("FriendManager deployed");

        const TipManager = await ethers.getContractFactory("TipManager");
        console.log("Contract factory created");

        const tipManager = await TipManager.deploy(await friendManager.getAddress());
        console.log("Contract deployment initiated");

        await tipManager.waitForDeployment();
        console.log("Contract deployment completed");

        console.log("Contract address:", await tipManager.getAddress());
        console.log("Owner address:", owner.address);
        console.log("Other account address:", otherAccount.address);

        return { tipManager, friendManager, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { tipManager, owner } = await loadFixture(deployFixture);
            expect(await tipManager.tipManagerOwner()).to.equal(owner.address);
        });
    });

    describe("Tip sender and event NewTip", function () {
        it("Should correctly record a tip using address", async function () {
            const { tipManager, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            const name = "Alice";
            const message = "Great job!";
            const toAddress = BigInt(otherAccount.address);

            await expect(tipManager.connect(otherAccount).tip(name, message, toAddress, false, { value: tipAmount }))
                .to.emit(tipManager, "NewTip")
                .withArgs(otherAccount.address, otherAccount.address, anyValue, name, message, tipAmount);

            const tips = await tipManager.getTips();
            expect(tips.length).to.equal(1);
            expect(tips[0].name).to.equal(name);
            expect(tips[0].message).to.equal(message);
            expect(tips[0].from).to.equal(otherAccount.address);
        });

        it("Should correctly record a tip using friend index", async function () {
            const { tipManager, friendManager, owner, otherAccount } = await loadFixture(deployFixture);
            
            // Ajouter un ami
            await friendManager.connect(owner).addFriend(otherAccount.address, "Friend");
            
            const tipAmount = ethers.parseEther("0.1");
            const name = "Bob";
            const message = "Thanks!";
            const friendIndex = 0;

            await expect(tipManager.connect(owner).tip(name, message, friendIndex, true, { value: tipAmount }))
                .to.emit(tipManager, "NewTip")
                .withArgs(owner.address, otherAccount.address, anyValue, name, message, tipAmount);
        });
    });

    describe("Withdraw by the owner", function () {
        it("Should allow only the owner to withdraw tips and leave contract balance at zero", async function () {
            const { tipManager, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            
            await tipManager.connect(otherAccount).tip("Test", "Test message", BigInt(owner.address), false, { value: tipAmount });

            const commissionRate = await tipManager.commissionRate();
            const expectedCommission = (tipAmount * BigInt(commissionRate)) / 100n;

            await expect(tipManager.connect(otherAccount).withdrawTips())
                .to.be.revertedWith("Only owner can perform this action");

            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

            const tx = await tipManager.connect(owner).withdrawTips();
            const receipt = await tx.wait();

            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            const newOwnerBalance = await ethers.provider.getBalance(owner.address);

            expect(newOwnerBalance).to.equal(initialOwnerBalance + expectedCommission - gasUsed);

            expect(await ethers.provider.getBalance(tipManager.getAddress())).to.equal(0);
        });
    });

    describe("Commission Rate", function () {
        it("Should allow owner to change commission rate", async function () {
            const { tipManager, owner } = await loadFixture(deployFixture);
            const newRate = 10;
            
            await expect(tipManager.connect(owner).setCommissionRate(newRate))
                .to.emit(tipManager, "CommissionRateChanged").withArgs(newRate);
            
            expect(await tipManager.commissionRate()).to.equal(newRate);
        });
    
        it("Should not allow non-owner to change commission rate", async function () {
            const { tipManager, otherAccount } = await loadFixture(deployFixture);
            const newRate = 10;
            
            await expect(tipManager.connect(otherAccount).setCommissionRate(newRate)).to.be.revertedWith("Only owner can perform this action");
        });
    });

    describe("Tipping with different commission rates", function () {
        it("Should correctly calculate commission and amount sent with different rates", async function () {
            const { tipManager, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("1");
            const rates = [5, 10, 15];
    
            for (const rate of rates) {
                await tipManager.connect(owner).setCommissionRate(rate);
                
                const initialBalance = await ethers.provider.getBalance(otherAccount.address);
                
                await tipManager.connect(owner).tip("Test", "Test message", BigInt(otherAccount.address), false, { value: tipAmount });
                
                const finalBalance = await ethers.provider.getBalance(otherAccount.address);
                const expectedCommission = (tipAmount * BigInt(rate)) / 100n;
                const expectedAmount = tipAmount - expectedCommission;
                
                expect(finalBalance - initialBalance).to.equal(expectedAmount);
            }
        });
    });

    describe("Tipping to null address", function () {
        it("Should revert when trying to tip to a null address", async function () {
            const { tipManager, owner } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            const nullAddress = 0n;
    
            await expect(tipManager.connect(owner).tip("Test", "Test message", nullAddress, false, { value: tipAmount }))
                .to.be.revertedWith("Cannot send to zero address");
        });
    });

    describe("getTips function", function () {
        it("Should return all recorded tips", async function () {
            const { tipManager, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            
            await tipManager.connect(owner).tip("Tip1", "Message1", BigInt(otherAccount.address), false, { value: tipAmount });
            await tipManager.connect(otherAccount).tip("Tip2", "Message2", BigInt(owner.address), false, { value: tipAmount });
            
            const tips = await tipManager.getTips();
            expect(tips.length).to.equal(2);
            expect(tips[0].name).to.equal("Tip1");
            expect(tips[1].name).to.equal("Tip2");
        });
    });
});