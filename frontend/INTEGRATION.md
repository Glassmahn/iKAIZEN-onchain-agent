# Frontend Integration Guide

## Overview
The frontend is now fully wired to the backend with proper state management and Web3 integration. Here's what has been set up:

## Setup Instructions

### 1. Install Additional Dependencies

```bash
cd frontend
npm install wagmi @rainbow-me/rainbowkit viem
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Key Configuration:**
- `NEXT_PUBLIC_API_URL` — Backend API endpoint (default: http://localhost:3001)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` — Get from WalletConnect Cloud
- `NEXT_PUBLIC_0G_RPC_URL` — 0G testnet RPC
- `NEXT_PUBLIC_AGENT_NFT_ADDRESS` — Deployed AgentNFT contract address
- `NEXT_PUBLIC_AGENT_MARKET_ADDRESS` — Deployed AgentMarket contract address

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard`

## Architecture

### Providers (`/lib/`)

#### `web3-config.ts`
- Wagmi and RainbowKit configuration
- Supports Sepolia testnet and 0G Galileo testnet
- Multi-chain setup for testing and production

#### `api-client.ts`
- REST API client for backend communication
- Endpoints:
  - `GET /api/soul` — Fetch agent soul
  - `PUT /api/soul` — Update agent soul (risk tolerance, goal)
  - `POST /api/agent/cycle` — Trigger agent thinking cycle
  - `POST /api/agent/pause` — Pause autonomous trading
  - `POST /api/agent/resume` — Resume trading
  - `POST /api/agent/reflect` — Force reflection
  - `GET /api/activity` — Get activity feed
  - `GET /api/trades` — Get trade history
  - `GET /api/agent/stats` — Get agent statistics

#### `agent-context.tsx`
- React Context for global agent state
- Auto-refreshes every 30 seconds
- Provides methods:
  - `refreshSoul()` — Manually refresh soul data
  - `refreshStats()` — Manually refresh stats
  - `updateSoulRiskTolerance(risk)` — Update risk percentage
  - `updateSoulGoal(goal)` — Update trading goal
  - `triggerCycle()` — Start agent cycle
  - `pauseAgent()` / `resumeAgent()` — Toggle automation
  - `forceReflection()` — Immediate reflection

#### `web3-hooks.ts`
- Custom hooks for contract interaction:
  - `useMintAgent()` — Mint a new iNFT
  - `useAgentBalance()` — Read user's iNFT balance
  - `useMarketFeeRate()` — Read marketplace fee rate

### Components Updated

#### Dashboard Components
- **StatsCards** — Now fetches real data from `soul` and `stats`
- **QuickActions** — Buttons wired to:
  - Trigger Cycle → `triggerCycle()`
  - Pause/Resume → `pauseAgent()` / `resumeAgent()`
  - Force Reflection → `forceReflection()`
  - Edit Parameters → Routes to `/dashboard/settings`
- **AgentSoul** — Displays real soul data with memory from agent
- **DashboardHeader** — Now includes RainbowKit wallet connection

### Pages
- **Settings** (`/dashboard/settings`) — Risk tolerance and goal update
- **Soul** (`/dashboard/soul`) — Full soul viewer
- **Trades** (`/dashboard/trades`) — Trade history
- **Activity** (`/dashboard/activity`) — Activity feed
- **Wallet** (`/dashboard/wallet`) — Wallet management
- **Mint** (`/dashboard/mint`) — iNFT minting form

## Backend Requirements

The frontend expects these API endpoints on your backend:

### Soul Management
```
GET /api/soul
Response: { goal, memory[], strategyVersion, riskTolerance, totalTrades, totalPnL, lastAction, createdAt }

PUT /api/soul
Body: { goal?, riskTolerance? }
Response: Same as GET
```

### Agent Control
```
POST /api/agent/cycle
Response: { success, txHash? }

POST /api/agent/pause
POST /api/agent/resume
Response: { success }

POST /api/agent/reflect
Response: { success }
```

### Analytics
```
GET /api/agent/stats
Response: { totalTrades, winRate, portfolioValue, pnL, lastCycle, nextCycleIn }

GET /api/activity?limit=20
Response: [{ type, title, description, time, status }]

GET /api/trades?limit=50
Response: [{ from, to, fromAmount, toAmount, date, pnL, status, txHash }]
```

## Data Flow

```
User Action (e.g., click "Trigger Cycle")
    ↓
Component calls useAgent() hook
    ↓
AgentContext calls apiClient.triggerAgentCycle()
    ↓
API sends POST to backend
    ↓
Backend processes action (calls agent/trader.ts)
    ↓
Response returned to frontend
    ↓
Component refreshes soul + stats
    ↓
UI updates with new data
```

## Loading States

All components properly display loading states:
- Cards pulse with `animate-pulse` class
- Buttons show loading spinner (`RefreshCw` icon)
- Error messages display in red alert boxes
- Success messages flash briefly

## Example Usage in Component

```tsx
import { useAgent } from '@/lib/agent-context'

export function MyComponent() {
  const { soul, stats, loading, error, triggerCycle } = useAgent()

  const handleClick = async () => {
    try {
      await triggerCycle()
      // UI auto-updates via context
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <button onClick={handleClick}>
      Trigger Cycle
    </button>
  )
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Prod
Set these in your hosting platform:
- `NEXT_PUBLIC_API_URL` — Production backend URL
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` — Production WalletConnect ID
- All other `NEXT_PUBLIC_*` variables

### Vercel Deployment
```bash
vercel deploy
```

## Troubleshooting

### Wallet not connecting?
- Check `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set
- Ensure you're on a supported chain (Sepolia or 0G Testnet)

### API calls failing?
- Verify `NEXT_PUBLIC_API_URL` points to running backend
- Check CORS settings on backend
- Look at browser console for error details

### Agent data not updating?
- Verify backend is running and soul.json exists
- Check API response format matches `Soul` interface
- Look at network tab in DevTools

## Next Steps

1. ✅ Set up environment variables
2. ✅ Install dependencies
3. ✅ Implement backend API endpoints
4. ✅ Start frontend dev server
5. ✅ Test wallet connection
6. ✅ Test agent cycle trigger
7. ✅ Monitor real data flow in dashboard
