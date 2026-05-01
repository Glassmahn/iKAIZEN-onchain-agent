"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const func = async function (hre) {
    const { getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    console.log("🚀 Deploying AgentNFT with account:", deployer);
    const existingAgentNFT = await hre.deployments.getOrNull(utils_1.CONTRACTS.AgentNFT.name);
    if (existingAgentNFT) {
        console.log("✅ AgentNFT already deployed at:", existingAgentNFT.address);
        return;
    }
    const verifierDeployment = await hre.deployments.get(utils_1.CONTRACTS.Verifier.name);
    console.log("📋 Using Verifier at:", verifierDeployment.address);
    console.log("📝 Deploying AgentNFT with Beacon Proxy...");
    const nftName = process.env.ZG_iNFT_NAME || "0G Agent NFT";
    const nftSymbol = process.env.ZG_iNFT_SYMBOL || "0GI";
    const chainURL = process.env.ZG_RPC_URL || "https://evmrpc-testnet.0g.ai";
    const indexerURL = process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai";
    const storageInfo = JSON.stringify({
        chainURL,
        indexerURL
    });
    const AgentNFTFactory = await hre.ethers.getContractFactory("AgentNFT");
    const agentNFTInitData = AgentNFTFactory.interface.encodeFunctionData("initialize", [
        nftName,
        nftSymbol,
        storageInfo,
        verifierDeployment.address,
        deployer
    ]);
    await (0, utils_1.deployInBeaconProxy)(hre, utils_1.CONTRACTS.AgentNFT, false, [], agentNFTInitData);
    const agentNFTDeployment = await hre.deployments.get(utils_1.CONTRACTS.AgentNFT.name);
    console.log("✅ AgentNFT deployed at:", agentNFTDeployment.address);
};
func.tags = ["agentNFT", "core", "prod"];
func.dependencies = ["verifier"];
exports.default = func;
