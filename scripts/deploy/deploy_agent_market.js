"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const func = async function (hre) {
    const { getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    console.log("🚀 Deploying AgentMarket with account:", deployer);
    const existingAgentMarket = await hre.deployments.getOrNull(utils_1.CONTRACTS.AgentMarket.name);
    if (existingAgentMarket) {
        console.log("✅ AgentMarket already deployed at:", existingAgentMarket.address);
        return;
    }
    const agentNFTDeployment = await hre.deployments.get(utils_1.CONTRACTS.AgentNFT.name);
    console.log("📋 Using AgentNFT at:", agentNFTDeployment.address);
    console.log("📝 Deploying AgentMarket with Beacon Proxy...");
    const initialFeeRate = process.env.ZG_INITIAL_FEE_RATE || "1000";
    const initialMintFee = process.env.ZG_INITIAL_MINT_FEE || "100000000000000000";
    const initialDiscountMintFee = process.env.INITIAL_DISCOUNT_MINT_FEE || "0";
    const AgentMarketFactory = await hre.ethers.getContractFactory("AgentMarket");
    const agentMarketInitData = AgentMarketFactory.interface.encodeFunctionData("initialize", [
        agentNFTDeployment.address,
        BigInt(initialFeeRate),
        deployer,
        BigInt(initialMintFee),
        BigInt(initialDiscountMintFee)
    ]);
    await (0, utils_1.deployInBeaconProxy)(hre, utils_1.CONTRACTS.AgentMarket, false, [], agentMarketInitData);
    const agentMarketDeployment = await hre.deployments.get(utils_1.CONTRACTS.AgentMarket.name);
    console.log("✅ AgentMarket deployed at:", agentMarketDeployment.address);
};
func.tags = ["agentMarket", "core", "prod"];
func.dependencies = ["agentNFT"];
exports.default = func;
