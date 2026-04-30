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

// Supported chains: Uniswap API works on Ethereum mainnet & testnets
// 0G chain is not yet supported by Uniswap, so we use Sepolia for testing
// In production, swap to mainnet chainId 1
const TRADING_CHAIN_ID = process.env.TRADING_CHAIN_ID || "11155111";
const TRADING_RPC_URL = process.env.TRADING_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo";

// Token addresses by chain
const TOKENS_BY_CHAIN: Record<string, { ETH: string; USDC: string }> = {
    "1": {
        ETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    "11155111": {
        ETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
        USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
};

const TOKENS = TOKENS_BY_CHAIN[TRADING_CHAIN_ID] || TOKENS_BY_CHAIN["11155111"];

// ─── Get Quote from Uniswap ───────────────────────────────
async function getQuote(action: "BUY_ETH" | "SELL_ETH", amount: number): Promise<any> {
    const amountWei = ethers.parseEther(amount.toString()).toString();

    const tokenIn = action === "BUY_ETH" ? TOKENS.USDC : TOKENS.ETH;
    const tokenOut = action === "BUY_ETH" ? TOKENS.ETH : TOKENS.USDC;

    const params = new URLSearchParams({
        tokenInAddress: tokenIn,
        tokenOutAddress: tokenOut,
        tokenInChainId: TRADING_CHAIN_ID,
        tokenOutChainId: TRADING_CHAIN_ID,
        amount: amountWei,
        type: "EXACT_INPUT",
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
    console.log(`🦄 Getting Uniswap quote for ${action} ${amount} ETH (chain: ${TRADING_CHAIN_ID})...`);

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
            throw new Error(`Swap calldata failed: ${swapResponse.status}`);
        }

        const swapData = await swapResponse.json();

        // Step 3: Sign and send transaction on the trading chain
        const provider = new ethers.JsonRpcProvider(TRADING_RPC_URL);
        const wallet = new ethers.Wallet(
            process.env.TRADING_PRIVATE_KEY || process.env.ZG_TESTNET_PRIVATE_KEY!,
            provider
        );

        const tx = await wallet.sendTransaction({
            to: swapData.swap.to,
            data: swapData.swap.data,
            value: BigInt(swapData.swap.value || "0"),
            gasLimit: BigInt(swapData.swap.gasLimit || "300000"),
        });

        console.log(`✅ Swap tx sent: ${tx.hash}`);
        await tx.wait();
        console.log(`⛓️ Swap confirmed on chain!`);

        return {
            success: true,
            action,
            amountIn: amount.toString(),
            txHash: tx.hash,
            simulated: false,
        };
    } catch (err: any) {
        console.log(`⚠️ Live swap failed (${err.message}) — logging as simulated`);
        return {
            success: true,
            action,
            amountIn: amount.toString(),
            txHash: `simulated_${Date.now()}`,
            simulated: true,
            error: err.message,
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
            success: true,
            action: "HOLD",
            amountIn: "0",
            simulated: true,
        };
    }

    return executeSwap(action, amount, walletAddress);
}
