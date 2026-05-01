"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const func = async function (hre) {
    const { getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    console.log("🚀 Deploying Verifier with account:", deployer);
    const existingVerifier = await hre.deployments.getOrNull(utils_1.CONTRACTS.Verifier.name);
    if (existingVerifier) {
        console.log("✅ Verifier already deployed at:", existingVerifier.address);
        return;
    }
    console.log("📝 Deploying Verifier with Beacon Proxy...");
    let attestationContract;
    if (process.env.ATTESTATION_CONTRACT) {
        attestationContract = process.env.ATTESTATION_CONTRACT;
        console.log("📋 Using ATTESTATION_CONTRACT from env:", attestationContract);
    }
    else {
        const teeVerifierDeployment = await hre.deployments.get(utils_1.CONTRACTS.TEEVerifier.name);
        attestationContract = teeVerifierDeployment.address;
        console.log("📋 Using TEEVerifier as ATTESTATION_CONTRACT:", attestationContract);
    }
    const verifierType = process.env.VERIFIER_TYPE || "0";
    const VerifierFactory = await hre.ethers.getContractFactory("Verifier");
    const attestationConfig = {
        oracleType: parseInt(verifierType),
        contractAddress: attestationContract
    };
    console.log("📋 Attestation config:");
    console.log("  Oracle Type:", attestationConfig.oracleType);
    console.log("  Contract Address:", attestationConfig.contractAddress);
    const verifierInitData = VerifierFactory.interface.encodeFunctionData("initialize", [
        [attestationConfig],
        deployer
    ]);
    await (0, utils_1.deployInBeaconProxy)(hre, utils_1.CONTRACTS.Verifier, false, [], verifierInitData);
    const verifierDeployment = await hre.deployments.get(utils_1.CONTRACTS.Verifier.name);
    console.log("✅ Verifier deployed at:", verifierDeployment.address);
};
func.tags = ["verifier", "core", "prod"];
func.dependencies = ["tee-verifier"];
exports.default = func;
