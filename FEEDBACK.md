# FEEDBACK.md — Uniswap Track

## Project: iKAIZEN — Autonomous Onchain Agent with ERC-7857 iNFT

### How We Used Uniswap

iKAIZEN integrates the **Uniswap Trading API** as its primary execution layer for autonomous token swaps. The agent uses Uniswap to execute BUY/SELL decisions on ETH/USDC pairs as part of its continuous improvement cycle.

#### Integration Details

1. **Quote Fetching** — Before each trade, iKAIZEN calls the Uniswap `/v1/quote` endpoint to get real-time pricing and optimal routing for the target trade pair.

2. **Swap Execution** — Using the `/v1/swap` endpoint, the agent receives calibrated calldata for on-chain execution, including gas estimates and slippage parameters.

3. **On-Chain Execution** — The signed swap transaction is submitted via ethers.js to the target network (Sepolia testnet for development, with plans for mainnet).

4. **Graceful Fallback** — When the Uniswap API is unavailable or compute-constrained, the agent logs the decision as simulated and retries on the next cycle, ensuring no agent cycle is wasted.

### Why Uniswap

-   **Best-in-class liquidity routing** — Uniswap's API provides optimal swap paths, critical for an autonomous agent that must minimize slippage without human oversight
-   **Clean API design** — The quote + swap two-step pattern fits naturally into the agent's decision → execute → reflect loop
-   **Testnet support** — Sepolia testnet support allowed us to develop and test the full trading pipeline risk-free

### Agent Trade Flow

```
Think (decision engine)
  │
  ▼
Get Uniswap Quote (USDC ↔ WETH)
  │
  ▼
Get Uniswap Swap Calldata
  │
  ▼
Sign & Submit Transaction
  │
  ▼
Reflect (update soul with outcome)
```

### Feedback on Uniswap API

-   **Excellent**: The two-step quote/swap API is well-designed for programmatic trading
-   **Suggestion**: Native support for 0G chain or other emerging L2s would expand use cases for autonomous agents
-   **Suggestion**: A webhook or event system for price alerts would complement agent decision-making

### Links

-   GitHub: https://github.com/glassmahn/ikaizen-onchain-agent
-   Live Demo: _TBD_
-   Medium: https://medium.com/@glassman4664/ikaizen-onchain-agent-537cbc3862d5
