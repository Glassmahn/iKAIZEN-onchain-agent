# KeeperHub Integration

## Overview
iKAIZEN uses KeeperHub to autonomously trigger agent cycles every 4 hours without any manual intervention.

## How It Works
1. KeeperHub runs on a cron schedule: `0 */4 * * *` (every 4 hours)
2. Each cycle triggers the iKAIZEN decision engine
3. The agent analyzes simulated ETH/USDC prices
4. Makes a trade decision: BUY_ETH, SELL_ETH, or HOLD
5. Updates its soul (memory + strategy) after each cycle

## Workflow Details
- **Trigger:** Schedule — every 4 hours
- **Action:** Run Code (JavaScript)
- **Agent:** iKAIZEN ERC-7857 iNFT
- **NFT Contract:** 0x1515d22b7Ea637D69c760C3986373FB976d96E8F
- **Network:** 0G Galileo Testnet (Chain ID: 16600)

## Why KeeperHub?
KeeperHub provides reliable, decentralized automation for on-chain agents.
Instead of running a server 24/7, iKAIZEN delegates its scheduling to KeeperHub,
making it truly autonomous — the NFT stays alive and keeps trading even when
the developer is offline.

## x402 Payments
The agent is designed to use x402 micropayments for autonomous KeeperHub
execution fees, allowing iKAIZEN to pay for its own upkeep from trading profits.