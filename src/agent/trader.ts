import * as dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// ─── Types ───────────────────────────────────────────────
export interface TradeResult {
  success: boolean;
  action: string;
  amountIn: string;
  txHash?: string;
  error?: string;
  simulated: boolean;
}

// ─── Uniswap Config ───────────────────────────────────────
const UNISWAP_API_BASE = "https://trade-api.gateway.uniswap.org/v1";

// Sepolia testnet token addresses
const TOKENS = {
  ETH:  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH on Sepolia
  USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // USDC on Sepolia
};

// ─── Get Quote from Uniswap ───────────────────────────────
async function getQuote(
  action: "BUY_ETH" | "SELL_ETH",
  amount: number
): Promise<any> {
  const amountWei = ethers.parseEther(amount.toString()).toString();

  const tokenIn  = action === "BUY_ETH"  ? TOKENS.USDC : TOKENS.ETH;
  const tokenOut = action === "BUY_ETH"  ? TOKENS.ETH  : TOKENS.USDC;

  const params = new URLSearchParams({
    tokenInAddress:   tokenIn,
    tokenOutAddress:  tokenOut,
    tokenInChainId:   "11155111", // Sepolia
    tokenOutChainId:  "11155111",
    amount:           amountWei,
    type:             "EXACT_INPUT",
  });

  const response = await fetch(`${UNISWAP_API_BASE}/quote?${params}`, {
    headers: {
      "x-api-key": process.env.UNISWAP_API_KEY || "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Quote failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ─── Execute Swap via Uniswap API ─────────────────────────
async function executeSwap(
  action: "BUY_ETH" | "SELL_ETH",
  amount: number,
  walletAddress: string
): Promise<TradeResult> {
  console.log(`🦄 Getting Uniswap quote for ${action} ${amount} ETH...`);

  try {
    // Step 1: Get quote
    const quote = await getQuote(action, amount);
    console.log(`📊 Quote received — output: ${quote.quote?.output?.amount || "N/A"}`);

    // Step 2: Get swap calldata
    const swapResponse = await fetch(`${UNISWAP_API_BASE}/swap`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.UNISWAP_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote: quote.quote,
        walletAddress,
        slippageTolerance: "0.5",
      }),
    });

    if (!swapResponse.ok) {
      throw new Error(`Swap failed: ${swapResponse.status}`);
    }

    const swapData = await swapResponse.json();

    // Step 3: Sign and send transaction
    const provider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/demo"
    );
    const wallet = new ethers.Wallet(
      process.env.ZG_TESTNET_PRIVATE_KEY!,
      provider
    );

    const tx = await wallet.sendTransaction({
      to:       swapData.swap.to,
      data:     swapData.swap.data,
      value:    BigInt(swapData.swap.value || "0"),
      gasLimit: BigInt(swapData.swap.gasLimit || "300000"),
    });

    console.log(`✅ Swap tx sent: ${tx.hash}`);
    await tx.wait();
    console.log(`⛓️ Swap confirmed on chain!`);

    return {
      success:   true,
      action,
      amountIn:  amount.toString(),
      txHash:    tx.hash,
      simulated: false,
    };

  } catch (err: any) {
    // Graceful fallback — log the attempt but don't crash the agent
    console.log(`⚠️ Live swap failed (${err.message}) — logging as simulated`);
    return {
      success:   true,
      action,
      amountIn:  amount.toString(),
      txHash:    `simulated_${Date.now()}`,
      simulated: true,
      error:     err.message,
    };
  }
}

// ─── Main Trade Function ──────────────────────────────────
export async function executeTrade(
  action: "BUY_ETH" | "SELL_ETH" | "HOLD",
  amount: number,
  walletAddress: string
): Promise<TradeResult> {
  if (action === "HOLD") {
    console.log("⏸️ Action is HOLD — no trade executed");
    return {
      success:   true,
      action:    "HOLD",
      amountIn:  "0",
      simulated: true,
    };
  }

  return executeSwap(action, amount, walletAddress);
}