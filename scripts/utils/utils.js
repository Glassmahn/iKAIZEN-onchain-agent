"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTRACTS = exports.UNFROZEN_ROLE = exports.OPERATOR_ROLE = exports.ADMIN_ROLE = exports.DEFAULT_ADMIN_ROLE = exports.Factories = void 0;
exports.deployDirectly = deployDirectly;
exports.deployInBeaconProxy = deployInBeaconProxy;
exports.getTypedContract = getTypedContract;
const common_1 = require("@typechain/ethers-v6/dist/common");
const ethers_1 = require("ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
exports.Factories = {};
try {
    exports.Factories = require("../../typechain-types");
}
catch (err) {
    // ignore
}
const UPGRADEABLE_BEACON = "UpgradeableBeacon";
const BEACON_PROXY = "BeaconProxy";
exports.DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
exports.ADMIN_ROLE = ethers_1.ethers.id("ADMIN_ROLE");
exports.OPERATOR_ROLE = ethers_1.ethers.id("OPERATOR_ROLE");
exports.UNFROZEN_ROLE = ethers_1.ethers.id("UNFROZEN_ROLE");
class ContractMeta {
    constructor(factory, name) {
        this.factory = factory;
        this.name = name ?? this.contractName();
    }
    contractName() {
        return this.factory?.name.slice(0, -common_1.FACTORY_POSTFIX.length);
    }
}
exports.CONTRACTS = {
    Verifier: new ContractMeta(exports.Factories.Verifier__factory),
    AgentNFT: new ContractMeta(exports.Factories.AgentNFT__factory),
    AgentMarket: new ContractMeta(exports.Factories.AgentMarket__factory),
    TEEVerifier: new ContractMeta(exports.Factories.TEEVerifier__factory),
};
async function deployDirectly(hre, contract, args = []) {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    // deploy implementation
    await deployments.deploy(contract.name, {
        from: deployer,
        contract: contract.contractName(),
        args: args,
        log: true,
    });
}
async function deployInBeaconProxy(hre, contract, onlyBeacon = false, args = [], initData = "0x") {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    // 1. Deploy implementation
    const implName = `${contract.name}Impl`;
    await deployments.deploy(implName, {
        from: deployer,
        contract: contract.contractName(),
        args: args,
        log: true,
    });
    const implementation = await hre.ethers.getContract(implName);
    // 2. Deploy beacon
    const beaconName = `${contract.name}Beacon`;
    await deployments.deploy(beaconName, {
        from: deployer,
        contract: UPGRADEABLE_BEACON,
        args: [await implementation.getAddress(), deployer],
        log: true,
    });
    const beacon = await hre.ethers.getContract(beaconName);
    if (!onlyBeacon) {
        // 3. Deploy proxy with initialization data
        await deployments.deploy(contract.name, {
            from: deployer,
            contract: BEACON_PROXY,
            args: [await beacon.getAddress(), initData],
            log: true,
        });
    }
}
async function getTypedContract(hre, contract, signer) {
    const address = await (await hre.ethers.getContract(contract.name)).getAddress();
    if (signer === undefined) {
        signer = (await hre.getNamedAccounts()).deployer;
    }
    if (typeof signer === "string") {
        signer = await hre.ethers.getSigner(signer);
    }
    return contract.factory.connect(address, signer);
}
