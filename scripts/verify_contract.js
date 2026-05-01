#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const CONTRACT_CONFIGS = {
    VERIFY_TEE_VERIFIER: {
        contracts: ['TEEVerifier', 'TEEVerifierBeacon', 'TEEVerifierImpl'],
        description: 'TEE Verifier contracts'
    },
    VERIFY_VERIFIER: {
        contracts: ['Verifier', 'VerifierBeacon', 'VerifierImpl'],
        description: 'Verifier contracts'
    },
    VERIFY_AGENT_NFT: {
        contracts: ['AgentNFT', 'AgentNFTBeacon', 'AgentNFTImpl'],
        description: 'Agent NFT contracts'
    },
    VERIFY_AGENT_MARKET: {
        contracts: ['AgentMarket', 'AgentMarketBeacon', 'AgentMarketImpl'],
        description: 'Agent Market contracts'
    }
};
class ContractVerifier {
    constructor(network) {
        this.network = network;
        this.deploymentsPath = this.getDeploymentsPath(network);
        this.validateSetup();
    }
    getDeploymentsPath(network) {
        const map = {
            zgTestnet: 'zg_testnet',
            zgMainnet: 'zg_mainnet',
        };
        return process.env[`${map[network].toUpperCase()}_DEPLOYMENTS_PATH`] || "";
    }
    validateSetup() {
        if (!fs_1.default.existsSync(this.deploymentsPath)) {
            throw new Error(`Deployments directory not found: ${this.deploymentsPath}`);
        }
    }
    readDeployment(contractName) {
        const filePath = path_1.default.join(this.deploymentsPath, `${contractName}.json`);
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
    formatConstructorArgs(args) {
        if (!args || args.length === 0) {
            return [];
        }
        return args.map(arg => {
            if (typeof arg === 'string' && arg.startsWith('0x')) {
                return arg;
            }
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return `"${arg}"`;
        });
    }
    buildVerifyCommand(contractName, deployment) {
        const { address, args = [] } = deployment;
        let command = `npx hardhat verify --network ${this.network}`;
        command += ` ${address}`;
        const formattedArgs = this.formatConstructorArgs(args);
        if (formattedArgs.length > 0) {
            command += ` ${formattedArgs.join(' ')}`;
        }
        return command;
    }
    async verifyContract(contractName) {
        console.log(`\nVerifying ${contractName}...`);
        const deployment = this.readDeployment(contractName);
        if (!deployment) {
            return {
                contractName,
                success: false,
                error: 'Deployment file not found'
            };
        }
        console.log(`Address: ${deployment.address}`);
        console.log(`Args: ${JSON.stringify(deployment.args || [])}`);
        const command = this.buildVerifyCommand(contractName, deployment);
        console.log(`Command: ${command}`);
        try {
            const output = (0, child_process_1.execSync)(command, {
                encoding: 'utf8',
                stdio: 'pipe',
                timeout: 60000
            });
            console.log(`${contractName} verified successfully!`);
            if (output.trim()) {
                console.log(`Output: ${output.trim()}`);
            }
            return {
                contractName,
                success: true,
                address: deployment.address
            };
        }
        catch (error) {
            const err = error;
            const errorMessage = err.message || 'Unknown error';
            if (errorMessage.includes('Already Verified') ||
                (err.stdout && err.stdout.includes('Already Verified'))) {
                console.log(`${contractName} is already verified.`);
                return {
                    contractName,
                    success: true,
                    address: deployment.address
                };
            }
            console.error(`Failed to verify ${contractName}:`);
            console.error(`Error: ${errorMessage}`);
            if (err.stdout) {
                console.error(`Stdout: ${err.stdout}`);
            }
            if (err.stderr) {
                console.error(`Stderr: ${err.stderr}`);
            }
            return {
                contractName,
                success: false,
                address: deployment.address,
                error: errorMessage
            };
        }
    }
    async verifyContractGroup(envKey) {
        const config = CONTRACT_CONFIGS[envKey];
        if (!config) {
            console.warn(`Unknown contract group: ${envKey}`);
            return [];
        }
        console.log(`\nVerifying ${config.description}...`);
        const results = [];
        for (let i = 0; i < config.contracts.length; i++) {
            const contractName = config.contracts[i];
            const result = await this.verifyContract(contractName);
            results.push(result);
            if (i < config.contracts.length - 1) {
                console.log('Waiting 3 seconds...');
                await this.delay(3000);
            }
        }
        console.log(`\n${config.description} Results:`);
        results.forEach(({ contractName, success }) => {
            const status = success ? 'SUCCESS' : 'FAILED';
            console.log(`  ${status}: ${contractName}`);
        });
        return results;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getEnabledContractGroups() {
        return Object.keys(CONTRACT_CONFIGS).filter(key => {
            const envValue = process.env[key];
            return envValue === 'true';
        });
    }
    async run() {
        console.log('Starting contract verification...');
        console.log(`Network: ${this.network}`);
        console.log(`Deployments path: ${this.deploymentsPath}`);
        const enabledGroups = this.getEnabledContractGroups();
        if (enabledGroups.length === 0) {
            console.log('\nNo contract groups enabled. Set environment variables to enable verification:');
            Object.keys(CONTRACT_CONFIGS).forEach(key => {
                console.log(`  ${key}=true`);
            });
            return;
        }
        console.log(`\nEnabled groups: ${enabledGroups.join(', ')}`);
        const allResults = [];
        for (const envKey of enabledGroups) {
            const results = await this.verifyContractGroup(envKey);
            allResults.push(...results);
        }
        this.printFinalResults(allResults);
    }
    printFinalResults(results) {
        console.log('\nFinal Verification Results:');
        console.log('='.repeat(50));
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        console.log(`Successful: ${successful.length}`);
        successful.forEach(({ contractName, address }) => {
            console.log(`  SUCCESS: ${contractName} (${address})`);
        });
        if (failed.length > 0) {
            console.log(`Failed: ${failed.length}`);
            failed.forEach(({ contractName, address, error }) => {
                console.log(`  FAILED: ${contractName} (${address || 'N/A'}) - ${error || 'Unknown error'}`);
            });
        }
        console.log('\nVerification completed!');
        if (failed.length > 0) {
            process.exit(1);
        }
    }
}
function parseArguments() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: ts-node verify-contracts.ts <network>');
        console.error('Example: ts-node verify-contracts.ts zgTestnet');
        process.exit(1);
    }
    return args[0];
}
async function main() {
    try {
        const network = parseArguments();
        const verifier = new ContractVerifier(network);
        await verifier.run();
    }
    catch (error) {
        console.error('Script failed:', error.message);
        process.exit(1);
    }
}
if (require.main === module) {
    main().catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
exports.default = ContractVerifier;
