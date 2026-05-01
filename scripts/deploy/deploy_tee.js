"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const func = async function (hre) {
    const { getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    console.log("🚀 Deploying TEEVerifier with account:", deployer);
    const existingTEEVerifier = await hre.deployments.getOrNull(utils_1.CONTRACTS.TEEVerifier.name);
    if (existingTEEVerifier) {
        console.log("✅ TEEVerifier already deployed at:", existingTEEVerifier.address);
        return;
    }
    console.log("📝 Deploying TEEVerifier with Beacon Proxy...");
    const oracleAddress = process.env.ORACLE_ADDRESS || "0x04581d192d22510ced643eaced12ef169644811a";
    const TEEVerifierFactory = await hre.ethers.getContractFactory("TEEVerifier");
    const initializeData = TEEVerifierFactory.interface.encodeFunctionData("initialize", [
        deployer,
        oracleAddress
    ]);
    await (0, utils_1.deployInBeaconProxy)(hre, utils_1.CONTRACTS.TEEVerifier, false, [], initializeData);
    const teeVerifierDeployment = await hre.deployments.get(utils_1.CONTRACTS.TEEVerifier.name);
    console.log("✅ TEEVerifier deployed at:", teeVerifierDeployment.address);
    const teeVerifier = await hre.ethers.getContractAt("TEEVerifier", teeVerifierDeployment.address);
    const teeOracleAddress = await teeVerifier.teeOracleAddress();
    console.log("🔍 Deployment verification:");
    console.log("  TEE Oracle Address:", teeOracleAddress);
};
func.tags = ["tee-verifier", "core", "prod"];
func.dependencies = [];
exports.default = func;
