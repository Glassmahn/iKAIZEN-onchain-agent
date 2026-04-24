import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import OpenAI from "openai";

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

// ─── Think (0G Compute AI) ───────────────────────────────
async function think(soul: Soul): Promise<AgentDecision> {
  console.log("🧠 iKAIZEN is thinking via 0G Compute...");

  const prompt = `You are iKAIZEN, an autonomous DeFi trading agent.
Goal: ${soul.goal}
Risk tolerance: ${soul.riskTolerance}
Total trades: ${soul.totalTrades}
Last action: ${soul.lastAction || "none"}
Recent memory: ${soul.memory.slice(-3).join(" | ") || "none"}
Simulated ETH price: $${(1800 + Math.random() * 400).toFixed(2)}

Decide what to do. Respond ONLY with valid JSON:
{"action":"BUY_ETH" or "SELL_ETH" or "HOLD","reason":"one sentence","confidence":0.0-1.0,"amount":0.001-0.01}`;

  try {
    const broker = await setupBroker();

    await broker.inference.acknowledgeProviderSigner(PROVIDER_ADDRESS);

    try {
      const transferAmount = ethers.parseEther("1.0");
      await broker.ledger.transferFund(PROVIDER_ADDRESS, "inference", transferAmount);
    } catch {
      // Already funded, continue
    }

    const { endpoint, model } = await broker.inference.getServiceMetadata(PROVIDER_ADDRESS);
    const headers = await broker.inference.getRequestHeaders(PROVIDER_ADDRESS, prompt);

    const openai = new OpenAI({
      baseURL: endpoint,
      apiKey: "",
      defaultHeaders: headers as unknown as Record<string, string>,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    const text = completion.choices[0].message.content!.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const decision = JSON.parse(clean) as AgentDecision;
    console.log(`🎯 Decision: ${decision.action} — ${decision.reason}`);
    return decision;

  } catch (err) {
    console.log("⚠️ 0G Compute unavailable, defaulting to HOLD");
    return { action: "HOLD", reason: "Compute unavailable, holding position", confidence: 1.0, amount: 0 };
  }
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

// ─── Main Agent Loop ─────────────────────────────────────
async function runAgentCycle(): Promise<void> {
  console.log("\n🚀 ====== iKAIZEN Agent Cycle Started ======");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  const soul = loadSoul();
  console.log(`📖 Soul loaded — version ${soul.strategyVersion}, ${soul.totalTrades} trades`);
  const decision = await think(soul);
  const updatedSoul = reflect(soul, decision);
  saveSoul(updatedSoul);
  console.log("\n📊 ====== Cycle Complete ======");
  console.log(`Action: ${decision.action}`);
  console.log(`Reason: ${decision.reason}`);
  console.log(`Total trades: ${updatedSoul.totalTrades}`);
  console.log(`Total PnL: ${updatedSoul.totalPnL} ETH`);
  console.log("================================\n");
}

runAgentCycle().catch(console.error);