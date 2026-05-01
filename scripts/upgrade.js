"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getDeploymentsPath(network) {
    const map = {
        zgTestnet: 'zg_testnet',
        zgMainnet: 'zg_mainnet',
    };
    return process.env[`${map[network].toUpperCase()}_DEPLOYMENTS_PATH`] || `deployments/${network}`;
}
function readDeployment(network, contractName) {
    const deploymentsPath = getDeploymentsPath(network);
    const filePath = path_1.default.join(deploymentsPath, `${contractName}.json`);
    if (!fs_1.default.existsSync(filePath)) {
        console.warn(`Warning: Deployment file not found: ${filePath}`);
        return null;
    }
    try {
        const content = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}
function updateDeploymentFiles(network, contractName, newImplAddress, upgradeTxHash, previousImplementation) {
    const deploymentsPath = getDeploymentsPath(network);
    // 1. 更新 Implementation 文件 (主要更新)
    const implFilePath = path_1.default.join(deploymentsPath, `${contractName}Impl.json`);
    updateImplementationFile(implFilePath, contractName, newImplAddress, upgradeTxHash, previousImplementation);
    // 2. 更新主合约文件中的 implementation 字段 (如果存在)
    const mainFilePath = path_1.default.join(deploymentsPath, `${contractName}.json`);
    updateMainContractFile(mainFilePath, contractName, newImplAddress, upgradeTxHash, previousImplementation);
}
function updateImplementationFile(filePath, contractName, newImplAddress, upgradeTxHash, previousImplementation) {
    try {
        let deployment = {
            address: newImplAddress,
            transactionHash: upgradeTxHash
        };
        // 如果文件已存在，读取现有数据
        if (fs_1.default.existsSync(filePath)) {
            const existingData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
            deployment = { ...existingData, ...deployment };
        }
        // 添加升级历史
        deployment.lastUpgrade = {
            timestamp: new Date().toISOString(),
            transactionHash: upgradeTxHash,
            previousImplementation: previousImplementation,
            newImplementation: newImplAddress
        };
        // 确保目录存在
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
        // 写入文件
        fs_1.default.writeFileSync(filePath, JSON.stringify(deployment, null, 2));
        console.log(`✅ Updated implementation file: ${filePath}`);
        console.log(`   Previous implementation: ${previousImplementation || 'N/A'}`);
        console.log(`   New implementation: ${newImplAddress}`);
    }
    catch (error) {
        console.error(`❌ Error updating implementation file ${filePath}:`, error);
    }
}
function updateMainContractFile(filePath, contractName, newImplAddress, upgradeTxHash, previousImplementation) {
    if (fs_1.default.existsSync(filePath)) {
        try {
            const deployment = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
            // 更新主合约文件中的 implementation 字段
            deployment.implementation = newImplAddress;
            deployment.lastUpgrade = {
                timestamp: new Date().toISOString(),
                transactionHash: upgradeTxHash,
                previousImplementation: previousImplementation,
                newImplementation: newImplAddress
            };
            fs_1.default.writeFileSync(filePath, JSON.stringify(deployment, null, 2));
            console.log(`✅ Updated main contract file: ${filePath}`);
        }
        catch (error) {
            console.error(`❌ Error updating main contract file ${filePath}:`, error);
        }
    }
}
function getContractAddress(network, contractName) {
    const deployment = readDeployment(network, contractName);
    return deployment ? deployment.address : null;
}
async function getBeaconAddress(beaconProxyAddress) {
    const BEACON_SLOT = "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50";
    const provider = hardhat_1.ethers.provider;
    const beaconAddressBytes = await provider.getStorage(beaconProxyAddress, BEACON_SLOT);
    return hardhat_1.ethers.getAddress("0x" + beaconAddressBytes.slice(26));
}
async function upgradeContract(contractName, proxyAddress, newImplementationAddress, network) {
    try {
        console.log(`\n=== Upgrading ${contractName} ===`);
        // 1. get the beacon address
        const beaconAddress = await getBeaconAddress(proxyAddress);
        console.log(`${contractName} Beacon address:`, beaconAddress);
        // 2. get the beacon contract instance
        const beacon = await hardhat_1.ethers.getContractAt("UpgradeableBeacon", beaconAddress);
        // 3. get current implementation address before upgrade
        const currentImplementation = await beacon.implementation();
        console.log(`Current implementation:`, currentImplementation);
        // 4. verify the permission
        const [deployer] = await hardhat_1.ethers.getSigners();
        const owner = await beacon.owner();
        if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
            throw new Error(`Not authorized to upgrade ${contractName}. Owner: ${owner}, Deployer: ${deployer.address}`);
        }
        // 5. execute the upgrade
        console.log(`Upgrading ${contractName} to:`, newImplementationAddress);
        const upgradeTx = await beacon.upgradeTo(newImplementationAddress);
        const receipt = await upgradeTx.wait();
        const txHash = receipt?.hash || upgradeTx.hash;
        // 6. verify the upgrade
        const newCurrentImpl = await beacon.implementation();
        const success = newCurrentImpl.toLowerCase() === newImplementationAddress.toLowerCase();
        console.log(`${contractName} upgrade ${success ? 'successful' : 'failed'}`);
        console.log(`New implementation:`, newCurrentImpl);
        console.log(`Transaction hash:`, txHash);
        // 7. update deployment file if upgrade successful
        if (success) {
            updateDeploymentFiles(network, contractName, newImplementationAddress, txHash, currentImplementation);
        }
        return { success, txHash };
    }
    catch (error) {
        console.error(`Error upgrading ${contractName}:`, error);
        return { success: false };
    }
}
async function performSafetyChecks(contractName, proxyAddress, newImplementationAddress) {
    try {
        console.log(`\n=== Safety Checks for ${contractName} ===`);
        // 1. check if the new implementation contract is deployed
        const code = await hardhat_1.ethers.provider.getCode(newImplementationAddress);
        if (code === "0x") {
            console.error(`❌ No code found at implementation address: ${newImplementationAddress}`);
            return false;
        }
        console.log("✅ Implementation contract has code");
        // 2. check if the proxy contract exists
        const proxyCode = await hardhat_1.ethers.provider.getCode(proxyAddress);
        if (proxyCode === "0x") {
            console.error(`❌ No code found at proxy address: ${proxyAddress}`);
            return false;
        }
        console.log("✅ Proxy contract exists");
        // 3. check contract version (now all contracts have VERSION)
        try {
            const contract = await hardhat_1.ethers.getContractAt(contractName, proxyAddress);
            const version = await contract.VERSION();
            console.log("✅ Contract version:", version);
        }
        catch (error) {
            console.warn("⚠️ Could not read contract version:", error);
        }
        return true;
    }
    catch (error) {
        console.error(`Safety check failed for ${contractName}:`, error);
        return false;
    }
}
async function main() {
    // Parse network from command line arguments or hardhat config
    let network;
    // Method 1: Check if running through hardhat with --network flag
    if (process.env.HARDHAT_NETWORK) {
        network = process.env.HARDHAT_NETWORK;
    }
    // Method 2: Check command line arguments (for pnpm/npm scripts)
    else if (process.argv[2]) {
        network = process.argv[2];
    }
    // Method 3: Check for --network flag in arguments
    else {
        const networkIndex = process.argv.findIndex(arg => arg === '--network');
        if (networkIndex !== -1 && process.argv[networkIndex + 1]) {
            network = process.argv[networkIndex + 1];
        }
    }
    if (!network) {
        console.error('Usage Options:');
        console.error('1. npx hardhat run scripts/upgrade.ts --network <network>');
        console.error('2. pnpm run upgrade <network>');
        console.error('Example: npx hardhat run scripts/upgrade.ts --network zgTestnet');
        console.error('Example: pnpm run upgrade zgTestnet');
        process.exit(1);
    }
    // configure the upgrade parameters
    const config = {
        upgradeTEEVerifier: process.env.UPGRADE_TEE_VERIFIER === "true",
        upgradeVerifier: process.env.UPGRADE_VERIFIER === "true",
        upgradeAgentNFT: process.env.UPGRADE_AGENT_NFT === "true",
        upgradeAgentMarket: process.env.UPGRADE_AGENT_MARKET === "true",
        performSafetyChecks: true,
        network: network
    };
    console.log("=== Smart Contract Upgrade Process ===");
    console.log(`Network: ${network}`);
    console.log(`Deployments path: ${getDeploymentsPath(network)}`);
    console.log("Configuration:", {
        upgradeTEEVerifier: config.upgradeTEEVerifier,
        upgradeVerifier: config.upgradeVerifier,
        upgradeAgentNFT: config.upgradeAgentNFT,
        upgradeAgentMarket: config.upgradeAgentMarket
    });
    const results = {
        teeVerifierUpgrade: false,
        verifierUpgrade: false,
        agentNFTUpgrade: false,
        agentMarketUpgrade: false
    };
    try {
        // 1. upgrade TEEVerifier (first, as it's a dependency)
        if (config.upgradeTEEVerifier) {
            const teeVerifierProxyAddress = getContractAddress(config.network, 'TEEVerifier');
            if (!teeVerifierProxyAddress) {
                console.error("❌ TEEVerifier proxy address not found in deployments");
                return;
            }
            console.log(`📍 TEEVerifier proxy address: ${teeVerifierProxyAddress}`);
            console.log("\n📋 Deploying new TEEVerifier implementation...");
            const TEEVerifierFactory = await hardhat_1.ethers.getContractFactory("TEEVerifier");
            const newTEEVerifierImpl = await TEEVerifierFactory.deploy(); // 可升级合约不需要构造函数参数
            await newTEEVerifierImpl.waitForDeployment();
            const teeVerifierImplAddress = await newTEEVerifierImpl.getAddress();
            console.log("✅ New TEEVerifier implementation:", teeVerifierImplAddress);
            // safety checks
            if (config.performSafetyChecks) {
                const safetyCheck = await performSafetyChecks("TEEVerifier", teeVerifierProxyAddress, teeVerifierImplAddress);
                if (!safetyCheck) {
                    console.error("❌ TEEVerifier safety checks failed");
                    return;
                }
            }
            // execute the upgrade
            const upgradeResult = await upgradeContract("TEEVerifier", teeVerifierProxyAddress, teeVerifierImplAddress, config.network);
            results.teeVerifierUpgrade = upgradeResult.success;
        }
        // 2. upgrade Verifier
        if (config.upgradeVerifier) {
            const verifierProxyAddress = getContractAddress(config.network, 'Verifier');
            if (!verifierProxyAddress) {
                console.error("❌ Verifier proxy address not found in deployments");
                return;
            }
            console.log(`📍 Verifier proxy address: ${verifierProxyAddress}`);
            console.log("\n📋 Deploying new Verifier implementation...");
            const VerifierFactory = await hardhat_1.ethers.getContractFactory("Verifier");
            const newVerifierImpl = await VerifierFactory.deploy();
            await newVerifierImpl.waitForDeployment();
            const verifierImplAddress = await newVerifierImpl.getAddress();
            console.log("✅ New Verifier implementation:", verifierImplAddress);
            // safety checks
            if (config.performSafetyChecks) {
                const safetyCheck = await performSafetyChecks("Verifier", verifierProxyAddress, verifierImplAddress);
                if (!safetyCheck) {
                    console.error("❌ Verifier safety checks failed");
                    return;
                }
            }
            // execute the upgrade
            const upgradeResult = await upgradeContract("Verifier", verifierProxyAddress, verifierImplAddress, config.network);
            results.verifierUpgrade = upgradeResult.success;
        }
        // 3. upgrade AgentNFT
        if (config.upgradeAgentNFT) {
            const agentNFTProxyAddress = getContractAddress(config.network, 'AgentNFT');
            if (!agentNFTProxyAddress) {
                console.error("❌ AgentNFT proxy address not found in deployments");
                return;
            }
            console.log(`📍 AgentNFT proxy address: ${agentNFTProxyAddress}`);
            console.log("\n📋 Deploying new AgentNFT implementation...");
            const AgentNFTFactory = await hardhat_1.ethers.getContractFactory("AgentNFT");
            const newAgentNFTImpl = await AgentNFTFactory.deploy();
            await newAgentNFTImpl.waitForDeployment();
            const agentNFTImplAddress = await newAgentNFTImpl.getAddress();
            console.log("✅ New AgentNFT implementation:", agentNFTImplAddress);
            // safety checks
            if (config.performSafetyChecks) {
                const safetyCheck = await performSafetyChecks("AgentNFT", agentNFTProxyAddress, agentNFTImplAddress);
                if (!safetyCheck) {
                    console.error("❌ AgentNFT safety checks failed");
                    return;
                }
            }
            // execute the upgrade
            const upgradeResult = await upgradeContract("AgentNFT", agentNFTProxyAddress, agentNFTImplAddress, config.network);
            results.agentNFTUpgrade = upgradeResult.success;
        }
        // 4. upgrade AgentMarket
        if (config.upgradeAgentMarket) {
            const agentMarketProxyAddress = getContractAddress(config.network, 'AgentMarket');
            if (!agentMarketProxyAddress) {
                console.error("❌ AgentMarket proxy address not found in deployments");
                return;
            }
            console.log(`📍 AgentMarket proxy address: ${agentMarketProxyAddress}`);
            console.log("\n📋 Deploying new AgentMarket implementation...");
            const AgentMarketFactory = await hardhat_1.ethers.getContractFactory("AgentMarket");
            const newAgentMarketImpl = await AgentMarketFactory.deploy();
            await newAgentMarketImpl.waitForDeployment();
            const agentMarketImplAddress = await newAgentMarketImpl.getAddress();
            console.log("✅ New AgentMarket implementation:", agentMarketImplAddress);
            // safety checks
            if (config.performSafetyChecks) {
                const safetyCheck = await performSafetyChecks("AgentMarket", agentMarketProxyAddress, agentMarketImplAddress);
                if (!safetyCheck) {
                    console.error("❌ AgentMarket safety checks failed");
                    return;
                }
            }
            // execute the upgrade
            const upgradeResult = await upgradeContract("AgentMarket", agentMarketProxyAddress, agentMarketImplAddress, config.network);
            results.agentMarketUpgrade = upgradeResult.success;
        }
        // 5. final verification
        console.log("\n=== Final Verification ===");
        if (config.upgradeTEEVerifier) {
            try {
                const teeVerifierProxyAddress = getContractAddress(config.network, 'TEEVerifier');
                if (teeVerifierProxyAddress) {
                    const teeVerifier = await hardhat_1.ethers.getContractAt("TEEVerifier", teeVerifierProxyAddress);
                    const version = await teeVerifier.VERSION();
                    console.log("✅ TEEVerifier version after upgrade:", version);
                }
            }
            catch (error) {
                console.warn("⚠️ Could not verify TEEVerifier after upgrade:", error);
            }
        }
        if (config.upgradeVerifier) {
            try {
                const verifierProxyAddress = getContractAddress(config.network, 'Verifier');
                if (verifierProxyAddress) {
                    const verifier = await hardhat_1.ethers.getContractAt("Verifier", verifierProxyAddress);
                    const version = await verifier.VERSION();
                    console.log("✅ Verifier version after upgrade:", version);
                }
            }
            catch (error) {
                console.warn("⚠️ Could not verify Verifier after upgrade:", error);
            }
        }
        if (config.upgradeAgentNFT) {
            try {
                const agentNFTProxyAddress = getContractAddress(config.network, 'AgentNFT');
                if (agentNFTProxyAddress) {
                    const agentNFT = await hardhat_1.ethers.getContractAt("AgentNFT", agentNFTProxyAddress);
                    const version = await agentNFT.VERSION();
                    console.log("✅ AgentNFT version after upgrade:", version);
                }
            }
            catch (error) {
                console.warn("⚠️ Could not verify AgentNFT after upgrade:", error);
            }
        }
        if (config.upgradeAgentMarket) {
            try {
                const agentMarketProxyAddress = getContractAddress(config.network, 'AgentMarket');
                if (agentMarketProxyAddress) {
                    const agentMarket = await hardhat_1.ethers.getContractAt("AgentMarket", agentMarketProxyAddress);
                    const version = await agentMarket.VERSION();
                    console.log("✅ AgentMarket version after upgrade:", version);
                }
            }
            catch (error) {
                console.warn("⚠️ Could not verify AgentMarket after upgrade:", error);
            }
        }
        // 6. summary
        console.log("\n=== Upgrade Summary ===");
        console.log("TEEVerifier upgrade:", results.teeVerifierUpgrade ? "✅ Success" : "❌ Failed/Skipped");
        console.log("Verifier upgrade:", results.verifierUpgrade ? "✅ Success" : "❌ Failed/Skipped");
        console.log("AgentNFT upgrade:", results.agentNFTUpgrade ? "✅ Success" : "❌ Failed/Skipped");
        console.log("AgentMarket upgrade:", results.agentMarketUpgrade ? "✅ Success" : "❌ Failed/Skipped");
        const overallSuccess = (!config.upgradeTEEVerifier || results.teeVerifierUpgrade) &&
            (!config.upgradeVerifier || results.verifierUpgrade) &&
            (!config.upgradeAgentNFT || results.agentNFTUpgrade) &&
            (!config.upgradeAgentMarket || results.agentMarketUpgrade);
        console.log("Overall upgrade:", overallSuccess ? "✅ Success" : "❌ Failed");
        if (!overallSuccess) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error("❌ Upgrade process failed:", error);
        process.exit(1);
    }
}
main()
    .then(() => {
    console.log("🎉 Upgrade process completed successfully");
    process.exit(0);
})
    .catch((error) => {
    console.error("💥 Upgrade process failed:", error);
    process.exit(1);
});
