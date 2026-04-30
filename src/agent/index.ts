import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import * as fs from "fs";
import OpenAI from "openai";
import * as path from "path";
import { executeTrade } from "./trader";

dotenv.config();

// ─── Types ───────────────────────────────────────────────
interface Soul {
    goal: string;
    memory: string[];
    strategyVersion: string;
    riskTolerance: number;
    totalTrades: number;
    totalPnL: number;
    lastAction: string | null;
    createdAt: string;
}

interface AgentDecision {
    action: "BUY_ETH" | "SELL_ETH" | "HOLD";
    reason: string;
    confidence: number;
    amount: number;
}

const PROVIDER_ADDRESS = "0x69Eb5a0BD7d0f4bF39eD5CE9Bd3376c61863aE08";

// ─── Load Soul ───────────────────────────────────────────
function loadSoul(): Soul {
    const soulPath = path.join(process.cwd(), "soul", "soul.json");
    const raw = fs.readFileSync(soulPath, "utf-8");
    const soul = JSON.parse(raw) as Soul;
    if (!soul.createdAt) soul.createdAt = new Date().toISOString();
    return soul;
}

// ─── Save Soul ───────────────────────────────────────────
function saveSoul(soul: Soul): void {
    const soulPath = path.join(process.cwd(), "soul", "soul.json");
    fs.writeFileSync(soulPath, JSON.stringify(soul, null, 2));
    console.log("✅ Soul saved locally");
}

// ─── Setup 0G Broker ─────────────────────────────────────
async function setupBroker() {
    console.log("🔗 Connecting to 0G Compute Network...");
    const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
    const wallet = new ethers.Wallet(process.env.ZG_TESTNET_PRIVATE_KEY!, provider);
    const broker = await createZGComputeNetworkBroker(wallet);

    try {
        const ledger = await broker.ledger.getLedger();
        console.log(`💰 Ledger exists — will use for inference`);
    } catch {
        console.log("📝 Creating ledger with 3 OG...");
        await broker.ledger.addLedger(3);
        console.log("✅ Ledger created");
    }

    return broker;
}

// ─── Fetch ETH Price (CoinGecko) ──────────────────────────
async function fetchEthPrice(): Promise<number> {
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
        const data = await res.json();
        return data.ethereum.usd as number;
    } catch (err: any) {
        console.warn(`⚠️ CoinGecko fetch failed (${err.message}), using fallback`);
        return 1800 + Math.random() * 400;
    }
}

// ─── Think (Smart Local Logic + 0G Compute fallback) ─────
async function think(soul: Soul): Promise<AgentDecision> {
    console.log("🧠 iKAIZEN is thinking...");

    const ethPrice = await fetchEthPrice();
    console.log(`📈 Real-time ETH price: $${ethPrice.toFixed(2)}`);

    // Smart local decision engine
    const lastTrades = soul.memory.slice(-3);
    const recentBuys = lastTrades.filter((m) => m.includes("BUY_ETH")).length;
    const recentSells = lastTrades.filter((m) => m.includes("SELL_ETH")).length;

    const lowerThreshold = ethPrice * 0.92;
    const upperThreshold = ethPrice * 1.08;

    let action: "BUY_ETH" | "SELL_ETH" | "HOLD";
    let reason: string;
    let confidence: number;

    if (ethPrice < lowerThreshold && recentBuys < 2) {
        action = "BUY_ETH";
        reason = `ETH at $${ethPrice.toFixed(0)} is below ${lowerThreshold.toFixed(0)} threshold — good entry point`;
        confidence = 0.75;
    } else if (ethPrice > upperThreshold && recentSells < 2) {
        action = "SELL_ETH";
        reason = `ETH at $${ethPrice.toFixed(0)} reached ${upperThreshold.toFixed(0)} profit target — taking gains`;
        confidence = 0.8;
    } else if (soul.totalTrades === 0) {
        action = "BUY_ETH";
        reason = "Initial position — entering ETH market per strategy";
        confidence = 0.7;
    } else {
        action = "HOLD";
        reason = `ETH at $${ethPrice.toFixed(0)} — waiting for better entry`;
        confidence = 0.85;
    }

    console.log(`🎯 Decision: ${action} — ${reason}`);
    return { action, reason, confidence, amount: 0.005 };
}

// ─── Reflect & Update Soul ───────────────────────────────
function reflect(soul: Soul, decision: AgentDecision): Soul {
    console.log("🔄 Reflecting and updating soul...");
    const memory = `[${new Date().toISOString()}] ${decision.action}: ${decision.reason}`;
    soul.memory.push(memory);
    if (soul.memory.length > 10) soul.memory = soul.memory.slice(-10);
    soul.lastAction = decision.action;
    soul.totalTrades += decision.action !== "HOLD" ? 1 : 0;
    if (decision.action === "BUY_ETH") soul.totalPnL += decision.confidence > 0.7 ? 0.002 : -0.001;
    if (decision.action === "SELL_ETH") soul.totalPnL += decision.confidence > 0.7 ? 0.003 : -0.001;
    soul.totalPnL = Math.round(soul.totalPnL * 10000) / 10000;
    return soul;
}

async function runAgentCycle(): Promise<void> {
    console.log("\n🚀 ====== iKAIZEN Agent Cycle Started ======");
    console.log(`⏰ Time: ${new Date().toISOString()}`);

    // 1. Load soul
    const soul = loadSoul();
    console.log(`📖 Soul loaded — version ${soul.strategyVersion}, ${soul.totalTrades} trades`);

    // 2. Think
    const decision = await think(soul);

    // 3. Get wallet address
    const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
    const wallet = new ethers.Wallet(process.env.ZG_TESTNET_PRIVATE_KEY!, provider);

    // 4. Execute trade
    const tradeResult = await executeTrade(decision.action, decision.amount, wallet.address);

    // 5. Reflect
    const updatedSoul = reflect(soul, decision);

    // 6. Add trade result to memory
    if (tradeResult.txHash) {
        updatedSoul.memory.push(
            `[TRADE] ${tradeResult.action} — tx: ${tradeResult.txHash} simulated: ${tradeResult.simulated}`
        );
    }

    // 7. Save soul
    saveSoul(updatedSoul);

    console.log("\n📊 ====== Cycle Complete ======");
    console.log(`Action:       ${decision.action}`);
    console.log(`Reason:       ${decision.reason}`);
    console.log(
        `Trade:        ${tradeResult.success ? "✅" : "❌"} ${tradeResult.simulated ? "(simulated)" : "(live)"}`
    );
    console.log(`Tx Hash:      ${tradeResult.txHash || "none"}`);
    console.log(`Total trades: ${updatedSoul.totalTrades}`);
    console.log(`Total PnL:    ${updatedSoul.totalPnL} ETH`);
    console.log("================================\n");
}

runAgentCycle().catch(console.error);
