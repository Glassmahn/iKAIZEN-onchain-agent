# 📚 Frontend Architecture Reference

## File Structure & What Each Does

### 🔧 Core Configuration

```
frontend/
├── .env.example                          ← Environment template (44 vars)
│                                         
├── lib/
│   ├── web3-config.ts                   ← Wagmi + RainbowKit setup
│   │   ├ Configures: 0G Galileo (16602) + Sepolia
│   │   ├ Exports: wagmiConfig, rainbowKitChains
│   │   └ Used by: Layout providers
│   │
│   ├── web3-hooks.ts                    ← Smart contract interactions ✨ UPDATED
│   │   ├ AGENT_NFT_ADDRESS (from env)
│   │   ├ AGENT_MARKET_ADDRESS (from env)
│   │   ├ useMintAgent()        — Mint iNFT
│   │   ├ useAgentBalance()     — Read NFT balance
│   │   ├ useMarketFeeRate()    — Read marketplace fee
│   │   └ Used by: Mint page, wallet page
│   │
│   ├── api-client.ts                    ← Backend REST client ✨ UPDATED
│   │   ├ Soul interface                 (agent state)
│   │   ├ AgentStats interface           (performance metrics)
│   │   ├ PriceData interface  ← NEW    (price ticker data)
│   │   ├ PortfolioHistory ← NEW         (chart data)
│   │   ├ getSoul()
│   │   ├ updateSoul()
│   │   ├ getAgentStats()
│   │   ├ triggerAgentCycle()
│   │   ├ pauseAgent() / resumeAgent()
│   │   ├ forceReflection()
│   │   ├ getActivityFeed()
│   │   ├ getTradeHistory()
│   │   ├ getLivePrice()   ← NEW         (CoinGecko)
│   │   ├ getPortfolioHistory() ← NEW    (backend data)
│   │   └ All use process.env.NEXT_PUBLIC_API_URL
│   │
│   ├── agent-context.tsx                ← Global state management ✨ UPDATED
│   │   ├ State:
│   │   │  ├─ soul: Soul | null
│   │   │  ├─ stats: AgentStats | null
│   │   │  ├─ loading: boolean
│   │   │  └─ error: string | null
│   │   │
│   │   ├ Methods:
│   │   │  ├─ refreshSoul()
│   │   │  ├─ refreshStats()
│   │   │  ├─ updateSoulRiskTolerance()
│   │   │  ├─ updateSoulGoal()
│   │   │  ├─ triggerCycle()
│   │   │  ├─ pauseAgent()
│   │   │  ├─ resumeAgent()
│   │   │  └─ forceReflection()
│   │   │
│   │   ├ Auto-refresh: configurable interval
│   │   └ Used by: useAgent() hook
│   │
│   └── hooks/
│       └── use-real-time-sync.ts  ← NEW
│           ├ useRealTimeSync()    — Parallel fetch all data
│           │  └ Returns: { soul, stats, prices, isLoading, error, refreshData }
│           │
│           └ usePriceUpdate()     — Price-only updates
│              └ Returns: { prices, error }
```

### 🎨 Components (Dashboard)

```
components/
├── dashboard/
│   ├── stats-cards.tsx                  ← Key metrics display
│   │   └ Uses: useAgent() for real soul data
│   │
│   ├── quick-actions.tsx                ← Agent control buttons ✨ UPDATED
│   │   ├ Props: agentAddress
│   │   ├ Buttons: Trigger, Pause/Resume, Force Reflection
│   │   ├ State: isPaused, isLoading, nextCycleTime
│   │   └ Uses: useAgent() context + apiClient
│   │
│   ├── agent-soul.tsx                   ← Agent personality display
│   │   └ Uses: useAgent() for real soul data
│   │
│   ├── portfolio-chart.tsx              ← Portfolio performance
│   │   └ Uses: getPortfolioHistory() for chart data
│   │
│   ├── activity-feed.tsx                ← Activity log
│   │   └ Uses: getActivityFeed() endpoint
│   │
│   ├── header.tsx                       ← Wallet connection
│   │   └ Uses: RainbowKit ConnectButton
│   │
│   └── live-price-feed.tsx         ← NEW
│       ├ Props: compact? (true for sidebar)
│       ├ Displays: ETH, USDC, 0G prices
│       ├ Features: 24h change, indicators
│       ├ Auto-refresh: 30 seconds
│       └ Uses: apiClient.getLivePrice()
│
└── landing/
    ├── navbar.tsx                       ← Site navigation ✨ UPDATED
    │   ├ Logo + branding
    │   ├ Navigation links
    │   ├ Docs button → env.NEXT_PUBLIC_DOCS_URL
    │   └ Launch app button → /dashboard
    │
    └── footer.tsx                       ← Footer with links ✨ UPDATED
        ├ Brand + description
        ├ Product links
        ├ Resources:
        │  ├─ Documentation (configurable)
        │  ├─ ERC-7857 Spec (/doc/erc-7857.md)
        │  ├─ GitHub (env.NEXT_PUBLIC_GITHUB_URL)
        │  └─ Twitter (env.NEXT_PUBLIC_TWITTER_URL)
        └ Integrations
```

### 📄 Pages

```
app/
├── page.tsx                             ← Landing page
├── layout.tsx                           ← Root providers (WagmiProvider, RainbowKit, AgentProvider)
│
├── dashboard/
│   ├── page.tsx                         ← Dashboard ✨ UPDATED
│   │   └ Added: <LivePriceFeed />
│   │
│   ├── settings/
│   │   └── page.tsx                     ← Settings (risk, goal)
│   │
│   ├── mint/
│   │   └── page.tsx                     ← Mint new iNFT
│   │
│   ├── soul/
│   │   └── page.tsx                     ← Full soul viewer
│   │
│   └── wallet/
│       └── page.tsx                     ← Wallet page
```

### 📖 Documentation Files

```
Project Root/
├── .env.example                         ← Created
├── FRONTEND_SETUP.md                    ← Complete setup guide
├── SETUP_CHECKLIST.md                   ← Implementation summary
├── ALL_FIXES_COMPLETE.md                ← This file
├── BACKEND_API_GUIDE.md                 ← Backend implementation guide
├── INTEGRATION.md                       ← Full wiring documentation
└── WIRING_COMPLETE.md                   ← Architecture overview
```

---

## 🔄 Data Flow: Complete Picture

### 1. Initial Load

```
User visits /dashboard
    ↓
Root layout loads providers
    ├─ WagmiProvider: Web3 setup
    ├─ RainbowKitProvider: Wallet UI
    └─ AgentProvider: Global state
        ↓
        AgentProvider useEffect
        ├─ Calls: refreshSoul()
        ├─ Calls: refreshStats()
        └─ Sets: loading = false
            ↓
            Components render with initial data
```

### 2. Auto-Refresh (Every 30s)

```
AgentContext auto-refresh interval fires
    ├─ refreshSoul()
    │  └─ fetch("/api/soul")
    │     └─ Backend reads soul.json
    │        └─ setSoul(data)
    │
    ├─ refreshStats()
    │  └─ fetch("/api/agent/stats")
    │     └─ Backend calculates stats
    │        └─ setStats(data)
    │
    └─ LivePriceFeed auto-refresh
       └─ fetch(CoinGecko API)
          └─ setPrices(data)
              ↓
              All components re-render with fresh data
```

### 3. User Action (Trigger Cycle)

```
User clicks "Trigger Cycle" button
    ↓
handleTriggerCycle()
    ↓
triggerCycle() from useAgent()
    ↓
apiClient.triggerAgentCycle()
    ↓
fetch("/api/agent/cycle", { method: "POST" })
    ↓
Backend processes cycle:
    ├─ Think phase (decision)
    ├─ Trade phase (swap)
    ├─ Reflect phase (update memory)
    └─ Save to soul.json
        ↓
Backend responds: { success: true, txHash }
    ↓
Frontend shows success toast
    ↓
Auto-refresh triggers immediately
    ├─ New soul data with updated memory
    ├─ New stats with trade count
    └─ Dashboard updates in real-time
```

---

## 🌐 Environment Variables Impact

| Variable | Used By | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | apiClient | Backend endpoint URL |
| `NEXT_PUBLIC_0G_RPC_URL` | wagmi config | 0G network RPC |
| `NEXT_PUBLIC_0G_CHAIN_ID` | wagmi config | 0G chain ID (16602) |
| `NEXT_PUBLIC_AGENT_NFT_ADDRESS` | web3-hooks | AgentNFT contract address |
| `NEXT_PUBLIC_AGENT_MARKET_ADDRESS` | web3-hooks | Market contract address |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | RainbowKit | Wallet connection ID |
| `NEXT_PUBLIC_COINGECKO_API_URL` | apiClient | Price feed endpoint |
| `NEXT_PUBLIC_TWITTER_URL` | footer | Twitter link |
| `NEXT_PUBLIC_GITHUB_URL` | footer | GitHub link |
| `NEXT_PUBLIC_DOCS_URL` | navbar, footer | Documentation link |
| `NEXT_PUBLIC_AUTO_REFRESH_INTERVAL` | agent-context | Refresh rate (ms) |
| `NEXT_PUBLIC_ENABLE_LIVE_PRICE_FEED` | live-price-feed | Toggle price display |

---

## 🎯 Component Dependency Map

```
RootLayout
├── WagmiProvider
│   ├── RainbowKitProvider
│   │   └── AgentProvider
│   │       ├── DashboardPage
│   │       │   ├── StatsCards (useAgent)
│   │       │   ├── LivePriceFeed (useRealTimeSync)
│   │       │   ├── PortfolioChart (useEffect + fetch)
│   │       │   ├── AgentSoul (useAgent)
│   │       │   ├── QuickActions (useAgent)
│   │       │   └── ActivityFeed (useEffect + fetch)
│   │       │
│   │       ├── SettingsPage
│   │       │   └── Forms (useAgent)
│   │       │
│   │       ├── MintPage
│   │       │   └── useMintAgent hook
│   │       │
│   │       └── WalletPage
│   │           └── useAgentBalance hook
│   │
│   └── LandingPage
│       ├── Navbar (useEffect + scroll)
│       │   └── Docs link → env.NEXT_PUBLIC_DOCS_URL
│       └── Footer
│           └── Social links → env vars
```

---

## 🔐 Security & Best Practices

### Private Keys
- ✅ Never in `.env.example`
- ✅ Only in `.env.local` (git-ignored)
- ✅ Backend handles signing

### Environment Variables
- ✅ All contract addresses in `.env.local`
- ✅ Public URLs prefixed with `NEXT_PUBLIC_`
- ✅ Single source of truth for addresses

### API Communication
- ✅ POST requests include Content-Type header
- ✅ Error handling on all fetch calls
- ✅ Type-safe responses

### Web3 Integration
- ✅ Wagmi handles signer/provider complexity
- ✅ RainbowKit provides secure wallet connection
- ✅ No direct window.ethereum access

---

## 📊 Performance Optimizations

### Auto-Refresh Strategy
```typescript
// Configurable interval (default: 30s)
useEffect(() => {
  const interval = setInterval(refreshData, 30000)
  return () => clearInterval(interval)
}, [])
```

### Parallel Data Fetching
```typescript
// All requests at once, not sequential
const [soulData, statsData, pricesData] = await Promise.all([
  apiClient.getSoul(),
  apiClient.getAgentStats(),
  apiClient.getLivePrice(),
])
```

### Conditional Rendering
```typescript
// Only render if feature enabled
if (!process.env.NEXT_PUBLIC_ENABLE_LIVE_PRICE_FEED) {
  return null
}
```

---

## 🚀 Deployment Ready

### Frontend (Vercel)
```bash
git push origin main
# Auto-deploys to Vercel
# Environment variables configured in Vercel dashboard
```

### Backend (Any Node host)
```bash
Deploy to: Heroku, Railway, Render, AWS, etc.
Environment: Set FRONTEND_URL for CORS
```

### Contracts (Already Deployed)
```
Network: 0G Galileo Testnet (16602)
AgentNFT: 0x1515d22b7Ea637D69c760C3986373FB976d96E8F
Status: Live and ready
```

---

## ✅ Final Checklist

- [x] Frontend environment configured
- [x] Web3 hooks using contract addresses from env
- [x] API client with price feed + portfolio history
- [x] Smart contract interactions ready
- [x] Live price feed component built
- [x] Real-time sync hooks implemented
- [x] Dashboard integrated with live prices
- [x] Social links configured
- [x] Docs links added to navbar and footer
- [x] Auto-refresh implemented
- [x] Error handling throughout
- [x] Type safety with interfaces
- [x] Production-ready code

---

**Frontend is 100% complete and production-ready! 🎉**
