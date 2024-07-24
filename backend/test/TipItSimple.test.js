const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("TipItSimple test", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        const TipItSimple = await ethers.getContractFactory("TipItSimple");
        const tipItSimple = await TipItSimple.deploy();
        
        console.log("Contract address:", tipItSimple.address);

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
            // Ensure the use of `ethers.parseEther`
            const tipAmount = ethers.parseEther("0.1");
            const name = "Alice";
            const message = "Great job!";
            await expect(tipItSimple.connect(otherAccount).tip(name, message, { value: tipAmount }))
                .to.emit(tipItSimple, "NewTip")
                .withArgs(otherAccount.address, anyValue, name, message);
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
            await tipItSimple.connect(owner).tip("Test", "Test message", { value: tipAmount });
    
            await expect(tipItSimple.connect(otherAccount).withdrawTips())
                .to.be.revertedWith("Only owner can withdraw");
        });
    });
});
