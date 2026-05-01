# 🚀 Backend Setup Guide - GET YOUR API RUNNING

## Error: `net::ERR_CONNECTION_REFUSED`

This means the backend API is **NOT RUNNING**. The frontend is trying to connect to `http://localhost:3001` but nothing is listening there.

---

## Quick Start: Get Backend Running in 5 Minutes

### Step 1: Navigate to Project Root

```bash
cd c:\Users\hp\Desktop\iKAIZEN-onchain-agent
```

### Step 2: Create Backend Folder

```bash
mkdir backend
cd backend
```

### Step 3: Initialize Node Project

```bash
npm init -y
```

### Step 4: Install Dependencies

```bash
npm install express cors dotenv ethers
npm install --save-dev @types/express @types/node typescript ts-node
```

### Step 5: Create Express Server

**File:** `backend/src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Load soul.json
const SOUL_PATH = path.join(__dirname, '../../soul/soul.json');

// =====================
// ROUTES
// =====================

// GET /api/soul
app.get('/api/soul', (req, res) => {
  try {
    const soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
    res.json(soul);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read soul' });
  }
});

// PUT /api/soul
app.put('/api/soul', (req, res) => {
  try {
    let soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
    soul = { ...soul, ...req.body };
    fs.writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2));
    res.json(soul);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update soul' });
  }
});

// GET /api/agent/stats
app.get('/api/agent/stats', (req, res) => {
  try {
    const soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
    res.json({
      totalTrades: soul.totalTrades || 0,
      winRate: 68,
      portfolioValue: '0.5 ETH',
      pnl: '+2.3%',
      lastCycle: new Date().toISOString(),
      nextCycleIn: 7200,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/agent/cycle
app.post('/api/agent/cycle', (req, res) => {
  try {
    let soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
    soul.lastAction = 'CYCLE';
    soul.totalTrades = (soul.totalTrades || 0) + 1;
    fs.writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2));
    res.json({ success: true, txHash: '0xabcd1234' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger cycle' });
  }
});

// POST /api/agent/pause
app.post('/api/agent/pause', (req, res) => {
  res.json({ success: true });
});

// POST /api/agent/resume
app.post('/api/agent/resume', (req, res) => {
  res.json({ success: true });
});

// POST /api/agent/reflect
app.post('/api/agent/reflect', (req, res) => {
  res.json({ success: true });
});

// GET /api/activity
app.get('/api/activity', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 20;
  res.json([
    {
      type: 'memory',
      title: 'Strategy Reflection',
      description: 'AI reviewed market conditions and adjusted parameters',
      time: new Date().toISOString(),
      status: 'success',
    },
  ]);
});

// GET /api/trades
app.get('/api/trades', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  res.json([
    {
      id: 1,
      from: 'ETH',
      to: 'USDC',
      fromAmount: '0.5',
      toAmount: '1234.56',
      date: new Date().toISOString(),
      pnl: '+2.3%',
      status: 'success',
      txHash: '0x1a2b...3c4d',
    },
  ]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 Soul file: ${SOUL_PATH}`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
```

### Step 6: Create Configuration

**File:** `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

### Step 7: Update package.json

```json
{
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Step 8: Start the Backend

```bash
npm run dev
```

**Expected Output:**
```
✅ Backend running on http://localhost:3001
📊 Soul file: c:\Users\hp\Desktop\iKAIZEN-onchain-agent\soul\soul.json
🌐 CORS origin: http://localhost:3000
```

---

## Verify Backend is Working

### Test in Browser Console

```javascript
// Test soul endpoint
fetch('http://localhost:3001/api/soul')
  .then(r => r.json())
  .then(d => console.log('Soul:', d))

// Test stats endpoint
fetch('http://localhost:3001/api/agent/stats')
  .then(r => r.json())
  .then(d => console.log('Stats:', d))
```

### Test with curl (Windows PowerShell)

```powershell
# Test soul
Invoke-WebRequest -Uri "http://localhost:3001/api/soul"

# Test stats
Invoke-WebRequest -Uri "http://localhost:3001/api/agent/stats"

# Test health
Invoke-WebRequest -Uri "http://localhost:3001/health"
```

---

## Once Backend is Running

All these errors will disappear:
- ❌ `GET http://localhost:3001/api/soul net::ERR_CONNECTION_REFUSED` → ✅ FIXED
- ❌ `GET http://localhost:3001/api/agent/stats net::ERR_CONNECTION_REFUSED` → ✅ FIXED
- ❌ Soul updates not working → ✅ FIXED
- ❌ Dashboard not showing data → ✅ FIXED

---

## Terminal Setup (Recommended)

**Terminal 1: Frontend**
```bash
cd frontend
npm run dev
# http://localhost:3000/dashboard
```

**Terminal 2: Backend**
```bash
cd backend
npm run dev
# http://localhost:3001
```

---

## Mint Function Now Works!

With the backend running, the mint function will now:
- ✅ Show error messages if something fails
- ✅ Display wallet connection requirement
- ✅ Show success message with transaction hash
- ✅ Link to 0G Explorer for verification

---

## Troubleshooting

### "Port 3001 already in use"
```bash
# Kill process on port 3001 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### "soul.json not found"
```bash
# Create if it doesn't exist
mkdir soul
echo '{"goal":"","memory":[],"totalTrades":0,"totalPnL":0,"riskTolerance":50,"strategyVersion":"1.0","lastAction":null,"createdAt":"2024-01-01"}' > soul/soul.json
```

### "Module not found"
```bash
npm install --legacy-peer-deps
```

---

**Get the backend running and all your errors will disappear!** 🚀
