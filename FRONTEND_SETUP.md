# 🚀 Complete Frontend Setup Guide

## ✅ What's Configured

### 1. Deployed Contracts (0G Galileo Testnet)
- **AgentNFT Proxy:** `0x1515d22b7Ea637D69c760C3986373FB976d96E8F`
- **AgentNFT Beacon:** `0x98681D02CE70885CBb477de0b228fb1bc03294da`
- **AgentNFT Implementation:** `0x443145E9c157F603DAc896E0093713715b3019a3`

### 2. Live Data Feeds
- ✅ **Live Price Feed** — ETH, USDC, 0G token prices with 24h change
- ✅ **Real-time Sync** — 30-second auto-refresh of soul, stats, prices
- ✅ **CoinGecko Integration** — Free price data via API

### 3. Social Links
- ✅ **Twitter** — https://twitter.com/ifu_naya2
- ✅ **GitHub** — https://github.com/glassmahn/iKAIZEN-onchain-agent
- ✅ **Docs** — Links to ERC-7857 spec and documentation

### 4. Web3 Integration
- ✅ **Wagmi Hooks** — Contract read/write operations
- ✅ **RainbowKit** — Wallet connection UI
- ✅ **0G Galileo Network** — Primary testnet configured

---

## ⚙️ Setup Steps

### Step 1: Create Environment File

```bash
cd frontend
cp .env.example .env.local
```

### Step 2: Configure `.env.local`

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# 0G Network (Already configured)
NEXT_PUBLIC_0G_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602

# Deployed Contract (Already filled in)
NEXT_PUBLIC_AGENT_NFT_ADDRESS=0x1515d22b7Ea637D69c760C3986373FB976d96E8F

# Wallet Connect Project ID (Get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Price Feed (CoinGecko - no API key needed)
NEXT_PUBLIC_ENABLE_LIVE_PRICE_FEED=true

# Auto-refresh interval (milliseconds)
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=30000
```

### Step 3: Install Dependencies

```bash
npm install wagmi @rainbow-me/rainbowkit viem
npm install
```

### Step 4: Start Frontend

```bash
npm run dev
```

Visit: **http://localhost:3000/dashboard**

---

## 🔄 How Everything Works

### Data Flow: Real-Time Updates

```
┌─────────────────────────────────────────┐
│      Frontend (React Component)          │
│                                         │
│  useRealTimeSync() Hook                 │
│  ├─ Fetches soul.json                  │
│  ├─ Fetches agent stats                │
│  └─ Fetches live prices (CoinGecko)   │
│                                         │
└──────────────┬──────────────────────────┘
               │
               │ Every 30 seconds
               ▼
┌─────────────────────────────────────────┐
│    Backend API (Node.js/Express)        │
│                                         │
│  GET /api/soul                          │
│  GET /api/agent/stats                   │
│  GET /api/portfolio-history             │
│                                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Data Sources                         │
│                                         │
│  ├─ soul.json (agent state)            │
│  ├─ contract storage (trades)          │
│  └─ blockchain events                  │
│                                         │
└─────────────────────────────────────────┘
```

### Component Integration

| Component | Data Source | Refresh |
|-----------|-------------|---------|
| **StatsCards** | useAgent() context | 30s auto |
| **LivePriceFeed** | CoinGecko API | 30s auto |
| **PortfolioChart** | Backend /api/portfolio-history | 30s auto |
| **QuickActions** | Context methods | On-click |
| **AgentSoul** | useAgent() context | 30s auto |
| **ActivityFeed** | Backend /api/activity | 30s auto |

---

## 🎯 Testing the Setup

### 1. Check Price Feed

```bash
# Should show live prices
curl "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,0g&vs_currencies=usd&include_24hr_change=true"
```

### 2. Check Backend Connection

```bash
# When backend is running:
curl http://localhost:3001/api/soul
curl http://localhost:3001/api/agent/stats
```

### 3. Test Contract Address

```bash
# View on 0G testnet explorer:
https://testnet.0gscan.xyz/address/0x1515d22b7Ea637D69c760C3986373FB976d96E8F
```

---

## 🌐 Features Now Available

### Dashboard Page (`/dashboard`)
- ✅ Real-time stats (portfolio value, trades, PnL)
- ✅ Live price ticker (ETH, USDC, 0G)
- ✅ Portfolio performance chart
- ✅ Agent soul viewer
- ✅ Quick action buttons
- ✅ Activity feed
- ✅ Trade history

### Settings Page (`/dashboard/settings`)
- ✅ Risk tolerance slider (persists to backend)
- ✅ Trading goal input (persists to backend)
- ✅ Save confirmation

### Landing Page
- ✅ Navbar with docs link
- ✅ Footer with Twitter & GitHub links
- ✅ Hero section
- ✅ Features section
- ✅ How it works
- ✅ Technology stack
- ✅ Roadmap

---

## 🔗 Social Links Configured

**Footer Links:**
- 📘 Docs → `/doc/erc-7857.md`
- 🐦 Twitter → `https://twitter.com/ifu_naya2`
- 🐙 GitHub → `https://github.com/glassmahn/iKAIZEN-onchain-agent`

**Navbar:**
- Docs button → Environment variable configurable
- Launch App → Directs to `/dashboard`

---

## 📊 Environment Variables Summary

```env
# Required (already set in .env.example)
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_0G_RPC_URL
NEXT_PUBLIC_AGENT_NFT_ADDRESS
NEXT_PUBLIC_TWITTER_URL
NEXT_PUBLIC_GITHUB_URL
NEXT_PUBLIC_DOCS_URL

# Optional (recommended for production)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL
NEXT_PUBLIC_ENABLE_LIVE_PRICE_FEED
NEXT_PUBLIC_DEBUG_MODE
```

---

## 🚨 Common Issues & Fixes

### Issue: "Contract address is undefined"
**Fix:** Ensure `.env.local` has `NEXT_PUBLIC_AGENT_NFT_ADDRESS` set

### Issue: "Price feed not updating"
**Fix:** Check that `NEXT_PUBLIC_ENABLE_LIVE_PRICE_FEED=true`

### Issue: "Backend connection failed"
**Fix:** Ensure backend is running on `http://localhost:3001`

### Issue: "Wallet not connecting"
**Fix:** Get `WALLET_CONNECT_PROJECT_ID` from https://cloud.walletconnect.com

---

## 📝 Next Steps

1. **Set up backend** — Follow `BACKEND_API_GUIDE.md`
2. **Configure wallet** — Get WalletConnect Project ID
3. **Test integration** — Connect wallet and trigger a cycle
4. **Deploy** — Frontend ready for Vercel, backend ready for production

---

## ✨ What's Ready to Use

### Frontend (100% Complete)
- ✅ All components built and styled
- ✅ Web3 integration configured
- ✅ Live price feed working
- ✅ Real-time sync implemented
- ✅ Social links configured
- ✅ Environment setup complete

### Backend (Template Provided)
- 📋 See `BACKEND_API_GUIDE.md` for implementation
- 📋 9 endpoints defined
- 📋 Ready for development

### Smart Contracts (Deployed)
- ✅ AgentNFT on 0G Galileo Testnet
- ✅ Ready for frontend interaction

---

This is everything you need to start using the iKAIZEN frontend! The backend is next.
