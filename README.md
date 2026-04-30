# iKAIZEN — Continuous Improvement Protocol

> **Every day is an opportunity to improve, even if only by 1%.**

iKAIZEN is an autonomous onchain agent built on the principle that progress compounds. It lives as an ERC-7857 Intelligent NFT (iNFT) on the 0G Galileo Testnet, making autonomous trading decisions, reflecting on outcomes, and evolving its strategy over time.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      iKAIZEN Protocol                        │
├──────────────┬──────────────────┬───────────────────────────┤
│  Frontend    │  Agent Backend   │  Smart Contracts           │
│  (Next.js)   │  (TypeScript)    │  (Solidity 0.8.20)         │
├──────────────┼──────────────────┼───────────────────────────┤
│  • Landing   │  • Soul engine   │  • ERC7857Upgradeable      │
│  • Mint UI   │  • Think cycle   │  • AgentNFT (iNFT)         │
│  • Dashboard │  • Trade exec    │  • AgentMarket             │
│  • Wallet    │  • Reflect/log   │  • TEEVerifier             │
└──────────────┴────────┬─────────┴─────────────┬─────────────┘
                        │                       │
              ┌─────────┴──────────┐   ┌───────┴──────────┐
              │ 0G Compute (Qwen)  │   │ 0G Galileo Testnet│
              │ KeeperHub (4h)     │   │ Chain ID: 16602   │
              │ Uniswap API        │   │                   │
              └────────────────────┘   └──────────────────┘
```

## ERC-7857: Intelligent NFT Standard

iKAIZEN implements ERC-7857, a novel NFT standard that enables **private metadata transfer** with cryptographic verification. Unlike ERC-721, transferring an agent NFT transfers not just tokenId ownership but also ownership of encrypted metadata — requiring a privacy-preserving, verifiable transfer mechanism.

### The Oracle Mechanism

The `transfer()` interface accepts a `proof` parameter that verifies conditions through an ideal oracle (implemented via TEE or ZKP):

1. **oldDataHash** — data encrypted from original metadata with sender's key
2. **newDataHash** — data encrypted from original metadata with receiver's new key
3. **Access confirmation** — oracle confirms receiver can access data behind newDataHash
4. **sealedKey** — new key encrypted with receiver's public key

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Sender  │ ──▶ │ TEE/ZKP  │ ──▶ │ Contract │
│  (key)   │     │  Oracle  │     │  (verify)│
└──────────┘     └──────────┘     └──────────┘
```

See `doc/` for full flow diagrams.

---

## Quick Start

### Prerequisites

-   Node.js 18+
-   MetaMask or Rabby wallet
-   0G Galileo Testnet added to wallet

### Setup

```bash
# Clone the repository
git clone https://github.com/glassmahn/ikaizen-onchain-agent.git
cd ikaizen-onchain-agent

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your private key and API keys
```

### Deploy Contracts

```bash
# Compile
npm run compile

# Deploy to 0G testnet
npm run deploy zgTestnet

# Verify on explorer
npm run verify:zgTestnet
```

### Run the Agent

```bash
npm run agent
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Contract Addresses (0G Galileo Testnet)

| Contract        | Address                                      |
| --------------- | -------------------------------------------- |
| AgentNFT (iNFT) | `0x1515d22b7Ea637D69c760C3986373FB976d96E8F` |
| TEEVerifier     | `0xcff69bA7d58a426A1503DFeA48f63ad7343f0153` |
| AgentMarket     | _See `deployments/zgTestnet/`_               |

---

## Agent Cycle

iKAIZEN runs on a **KeeperHub**-triggered 4-hour cycle:

1. **Load Soul** — retrieve strategy, memory, PnL from `soul.json`
2. **Think** — analyze market conditions, apply strategy
3. **Execute** — perform trade via Uniswap API (or simulated)
4. **Reflect** — update memory, adjust strategy based on outcome
5. **Evolve** — save updated soul for next cycle

```
┌──────┐   ┌──────┐   ┌─────────┐   ┌─────────┐   ┌──────┐
│ Load │──▶│ Think│──▶│ Execute │──▶│ Reflect │──▶│ Save │
│ Soul │   │      │   │ Trade   │   │ Outcome │   │ Soul │
└──────┘   └──────┘   └─────────┘   └─────────┘   └──────┘
     ▲                                                   │
     └────────────── KeeperHub (every 4h) ───────────────┘
```

---

## Soul Structure

```json
{
    "goal": "Maximize ETH-USDC yield safely with low risk",
    "memory": ["[2026-04-24] BUY_ETH: Initial position..."],
    "strategyVersion": "1.0",
    "riskTolerance": 0.15,
    "totalTrades": 3,
    "totalPnL": 0.004,
    "lastAction": "HOLD"
}
```

---

## Tech Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Smart Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin |
| Backend         | TypeScript, ethers.js v6, 0G SDK       |
| Frontend        | Next.js 16, React 19, Tailwind CSS v4  |
| AI/Compute      | 0G Serving Broker, Qwen model          |
| Trading         | Uniswap Trading API (Sepolia testnet)  |
| Automation      | KeeperHub (cron every 4h)              |
| Network         | 0G Galileo Testnet (Chain ID: 16602)   |

---

## Tracks

-   **0G Autonomous Agents & iNFT** — ERC-7857 implementation with onchain agent
-   **Uniswap Foundation** — Uniswap Trading API integration for autonomous swaps
-   **KeeperHub** — Decentralized automation for agent lifecycle

---

## Links

-   **Live Demo**: _TBD_
-   **Medium Article**: https://medium.com/@glassman4664/ikaizen-onchain-agent-537cbc3862d5
-   **ETHGlobal**: https://ethglobal.com/events/openagents
-   **Discord**: https://ethglobal.com/discord

---

## License

MIT — See `LICENSE.md`
