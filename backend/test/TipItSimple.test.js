const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("TipItSimple test", function () {
    async function deployFixture() {
        console.log("Starting deployment...");
        const [owner, otherAccount] = await ethers.getSigners();
        console.log("Signers obtained");

        const TipItSimple = await ethers.getContractFactory("TipItSimple");
        console.log("Contract factory created");

        const tipItSimple = await TipItSimple.deploy();
        console.log("Contract deployment initiated");

        await tipItSimple.waitForDeployment();
        console.log("Contract deployment completed");

        console.log("Contract address:", await tipItSimple.getAddress());
        console.log("Owner address:", owner.address);
        console.log("Other account address:", otherAccount.address);

        return { tipItSimple, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { tipItSimple, owner } = await loadFixture(deployFixture);
            const contractOwner = await tipItSimple.getOwner();
            expect(contractOwner).to.equal(owner.address);
        });
    });

    describe("Tip sender and event NewTip", function () {
        it("Should correctly record a tip", async function () {
            const { tipItSimple, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            const name = "Alice";
            const message = "Great job!";
            const toAddress = otherAccount.address;

            await expect(tipItSimple.connect(otherAccount).tip(name, message, toAddress, false, { value: tipAmount }))
                .to.emit(tipItSimple, "NewTip")
                .withArgs(otherAccount.address, toAddress, anyValue, name, message, anyValue);
            const tips = await tipItSimple.getTips();
            expect(tips.length).to.equal(1);
            expect(tips[0].name).to.equal(name);
            expect(tips[0].message).to.equal(message);
            expect(tips[0].from).to.equal(otherAccount.address);
        });
    });

    describe("Withdraw by the owner", function () {
        it("Should allow only the owner to withdraw tips and leave contract balance at zero", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.00002");
            
            // Envoyer un pourboire
            await tipItSimple.connect(owner).tip("Test", "Test message", owner.address, false, { value: tipAmount });

            // Obtenir le taux de commission
            const commissionRate = await tipItSimple.commissionRate();
            
            // Calculer la commission attendue
            const expectedCommission = (tipAmount * BigInt(commissionRate)) / 100n;

            // Vérifier que seul le propriétaire peut retirer
            await expect(tipItSimple.connect(otherAccount).withdrawTips())
                .to.be.revertedWith("Only owner can perform this action");

            // Obtenir le solde initial du propriétaire
            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

            // Effectuer le retrait
            const tx = await tipItSimple.connect(owner).withdrawTips();
            const receipt = await tx.wait();

            // Calculer les frais de gaz
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            // Obtenir le nouveau solde du propriétaire
            const newOwnerBalance = await ethers.provider.getBalance(owner.address);

            // Vérifier que le solde du propriétaire a augmenté du montant attendu (moins les frais de gaz)
            expect(newOwnerBalance).to.equal(initialOwnerBalance + expectedCommission - gasUsed);

            // Vérifier que le solde du contrat est à zéro
            expect(await ethers.provider.getBalance(tipItSimple.getAddress())).to.equal(0);
        });
    });

    describe("Commission Rate", function () {
        it("Should allow owner to change commission rate", async function () {
            const { tipItSimple, owner } = await loadFixture(deployFixture);
            const newRate = 10;
            
            await expect(tipItSimple.connect(owner).setCommissionRate(newRate))
                .to.emit(tipItSimple, "CommissionRateChanged").withArgs(newRate);
            
            expect(await tipItSimple.commissionRate()).to.equal(newRate);
        });
    
        it("Should not allow non-owner to change commission rate", async function () {
            const { tipItSimple, otherAccount } = await loadFixture(deployFixture);
            const newRate = 10;
            
            await expect(tipItSimple.connect(otherAccount).setCommissionRate(newRate)).to.be.revertedWith("Only owner can perform this action");
        });
    });

    describe("Tipping with different commission rates", function () {
        it("Should correctly calculate commission and amount sent with different rates", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("1");
            const rates = [5, 10, 15];
    
            for (const rate of rates) {
                await tipItSimple.connect(owner).setCommissionRate(rate);
                
                const initialBalance = await ethers.provider.getBalance(otherAccount.address);
                
                await tipItSimple.connect(owner).tip("Test", "Test message", otherAccount.address, false, { value: tipAmount });
                
                const finalBalance = await ethers.provider.getBalance(otherAccount.address);
                const expectedCommission = (tipAmount * BigInt(rate)) / 100n;
                const expectedAmount = tipAmount - expectedCommission;
                
                expect(finalBalance - initialBalance).to.equal(expectedAmount);
            }
        });
    });

    describe("Tipping to null address", function () {
        it("Should revert when trying to tip to a null address", async function () {
            const { tipItSimple, owner } = await loadFixture(deployFixture);
            const tipAmount = ethers.parseEther("0.1");
            const nullAddress = "0x0000000000000000000000000000000000000000";
    
            await expect(tipItSimple.connect(owner).tip("Test", "Test message", nullAddress, false, { value: tipAmount })).to.be.revertedWith("Cannot send to zero address");
        });
    });

    describe("addFriend function", function () {
        it("Should allow adding a new friend with a name", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const friendName = "John Doe";
            await expect(tipItSimple.connect(owner).addFriend(otherAccount.address, friendName))
                .to.emit(tipItSimple, "FriendAdded")
                .withArgs(owner.address, otherAccount.address, friendName);
            
            const isNowFriend = await tipItSimple.checkIsFriend(owner.address, otherAccount.address);
            expect(isNowFriend).to.be.true;
        });

        it("Should fail to add oneself as a friend", async function () {
            const { tipItSimple, owner } = await loadFixture(deployFixture);
            await expect(tipItSimple.connect(owner).addFriend(owner.address, "Myself"))
                .to.be.revertedWith("Cannot add yourself as a friend");
        });

        it("Should fail to add the same friend twice", async function () {
            const { tipItSimple, owner, otherAccount } = await loadFixture(deployFixture);
            const friendName = "John Doe";
            await tipItSimple.connect(owner).addFriend(otherAccount.address, friendName);
            await expect(tipItSimple.connect(owner).addFriend(otherAccount.address, friendName))
                .to.be.revertedWith("Already a friend");
        });
    });
});
