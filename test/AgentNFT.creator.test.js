"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("AgentNFT - Creator Functionality", function () {
    let agentNFT;
    let verifier;
    let admin;
    let creator;
    let user;
    let other;
    beforeEach(async function () {
        // Get all signers - Hardhat provides 20 by default
        const allSigners = await hardhat_1.ethers.getSigners();
        // Assign specific roles
        [admin, creator, user, other] = allSigners;
        // Deploy Verifier
        const VerifierFactory = await hardhat_1.ethers.getContractFactory("Verifier");
        const verifierContract = await VerifierFactory.deploy();
        await verifierContract.waitForDeployment();
        verifier = verifierContract;
        // Deploy AgentNFT implementation
        const AgentNFTFactory = await hardhat_1.ethers.getContractFactory("AgentNFT");
        const agentNFTImpl = await AgentNFTFactory.deploy();
        await agentNFTImpl.waitForDeployment();
        // Deploy proxy and initialize
        const initData = AgentNFTFactory.interface.encodeFunctionData("initialize", [
            "Test NFT",
            "TNFT",
            JSON.stringify({ test: "data" }),
            await verifier.getAddress(),
            admin.address
        ]);
        const BeaconFactory = await hardhat_1.ethers.getContractFactory("UpgradeableBeacon");
        const beacon = await BeaconFactory.deploy(await agentNFTImpl.getAddress(), admin.address);
        await beacon.waitForDeployment();
        const BeaconProxyFactory = await hardhat_1.ethers.getContractFactory("BeaconProxy");
        const proxy = await BeaconProxyFactory.deploy(await beacon.getAddress(), initData);
        await proxy.waitForDeployment();
        agentNFT = AgentNFTFactory.attach(await proxy.getAddress());
    });
    describe("Creator Tracking", function () {
        it("Should mint NFT with creator", async function () {
            // admin 有 MINTER_ROLE
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"].staticCall(user.address, "https://example.com/1.json", creator.address);
            const tx = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"](user.address, "https://example.com/1.json", creator.address);
            await (0, chai_1.expect)(tx)
                .to.emit(agentNFT, "CreatorSet")
                .withArgs(tokenId, creator.address);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(creator.address);
            (0, chai_1.expect)(await agentNFT.ownerOf(tokenId)).to.equal(user.address);
        });
        it("Should mint iNFT with creator", async function () {
            const intelligentData = [
                {
                    dataDescription: "Test Data",
                    dataHash: hardhat_1.ethers.randomBytes(32),
                },
            ];
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole((string,bytes32)[],address,address)"].staticCall(intelligentData, user.address, creator.address);
            const tx = await agentNFT
                .connect(admin)["mintWithRole((string,bytes32)[],address,address)"](intelligentData, user.address, creator.address);
            await (0, chai_1.expect)(tx)
                .to.emit(agentNFT, "CreatorSet")
                .withArgs(tokenId, creator.address);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(creator.address);
        });
        it("Should not emit CreatorSet event if creator is zero address", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"].staticCall(user.address, "https://example.com/1.json", hardhat_1.ethers.ZeroAddress);
            const tx = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"](user.address, "https://example.com/1.json", hardhat_1.ethers.ZeroAddress);
            await (0, chai_1.expect)(tx).to.not.emit(agentNFT, "CreatorSet");
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(hardhat_1.ethers.ZeroAddress);
        });
        it("Should allow operator to set creator manually", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address)"].staticCall(user.address);
            await agentNFT.connect(admin)["mintWithRole(address)"](user.address);
            await (0, chai_1.expect)(agentNFT.connect(admin).setCreator(tokenId, creator.address))
                .to.emit(agentNFT, "CreatorSet")
                .withArgs(tokenId, creator.address);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(creator.address);
        });
        it("Should allow operator to change creator", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"].staticCall(user.address, "", creator.address);
            await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"](user.address, "", creator.address);
            // Change creator to 'other'
            await agentNFT.connect(admin).setCreator(tokenId, other.address);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(other.address);
        });
        it("Should revert if non-operator tries to set creator", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address)"].staticCall(user.address);
            await agentNFT.connect(admin)["mintWithRole(address)"](user.address);
            await (0, chai_1.expect)(agentNFT.connect(user).setCreator(tokenId, creator.address)).to.be.reverted;
        });
        it("Should revert if setting creator for non-existent token", async function () {
            await (0, chai_1.expect)(agentNFT.connect(admin).setCreator(999, creator.address)).to.be.revertedWith("Token does not exist");
        });
        it("Should return zero address for NFT without creator", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address)"].staticCall(user.address);
            await agentNFT.connect(admin)["mintWithRole(address)"](user.address);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(hardhat_1.ethers.ZeroAddress);
        });
    });
    describe("Creator Persistence", function () {
        it("Should maintain creator after transfer", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"].staticCall(user.address, "", creator.address);
            await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"](user.address, "", creator.address);
            // Transfer NFT from user to other
            await agentNFT
                .connect(user)
                .transferFrom(user.address, other.address, tokenId);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(creator.address);
            (0, chai_1.expect)(await agentNFT.ownerOf(tokenId)).to.equal(other.address);
        });
        it("Should maintain creator after multiple transfers", async function () {
            const tokenId = await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"].staticCall(user.address, "", creator.address);
            await agentNFT
                .connect(admin)["mintWithRole(address,string,address)"](user.address, "", creator.address);
            await agentNFT
                .connect(user)
                .transferFrom(user.address, other.address, tokenId);
            await agentNFT
                .connect(other)
                .transferFrom(other.address, admin.address, tokenId);
            (0, chai_1.expect)(await agentNFT.creatorOf(tokenId)).to.equal(creator.address);
        });
    });
});
