# Backend API Implementation Guide

## Overview
This guide shows how to implement the REST API that the frontend expects.

## Project Structure Recommendation

```
backend/
├── src/
│   ├── server.ts          # Express server entry point
│   ├── routes/
│   │   ├── soul.ts        # Soul endpoints
│   │   ├── agent.ts       # Agent control endpoints
│   │   ├── activity.ts    # Activity log endpoints
│   │   └── trades.ts      # Trade history endpoints
│   ├── services/
│   │   ├── soul.ts        # Soul business logic
│   │   ├── agent.ts       # Agent business logic
│   │   └── trading.ts     # Trading logic
│   └── utils/
│       └── responses.ts   # Response helpers
├── package.json
└── tsconfig.json
```

## Implementation Steps

### 1. Set Up Express Server

**File:** `src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/soul', require('./routes/soul'));
app.use('/api/agent', require('./routes/agent'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/trades', require('./routes/trades'));

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 2. Soul Routes

**File:** `src/routes/soul.ts`

```typescript
import express from 'express';
import { getSoul, updateSoul } from '../services/soul';

const router = express.Router();

// GET /api/soul
router.get('/', async (req, res) => {
  try {
    const soul = await getSoul();
    res.json(soul);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch soul' });
  }
});

// PUT /api/soul
router.put('/', async (req, res) => {
  try {
    const { goal, riskTolerance } = req.body;
    const updated = await updateSoul({ goal, riskTolerance });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update soul' });
  }
});

export default router;
```

### 3. Agent Routes

**File:** `src/routes/agent.ts`

```typescript
import express from 'express';
import { 
  getStats, 
  triggerCycle, 
  pauseAgent as pauseAgentService,
  resumeAgent as resumeAgentService,
  forceReflection 
} from '../services/agent';

const router = express.Router();

// GET /api/agent/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/agent/cycle
router.post('/cycle', async (req, res) => {
  try {
    const result = await triggerCycle();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger cycle' });
  }
});

// POST /api/agent/pause
router.post('/pause', async (req, res) => {
  try {
    const result = await pauseAgentService();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to pause agent' });
  }
});

// POST /api/agent/resume
router.post('/resume', async (req, res) => {
  try {
    const result = await resumeAgentService();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to resume agent' });
  }
});

// POST /api/agent/reflect
router.post('/reflect', async (req, res) => {
  try {
    const result = await forceReflection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to force reflection' });
  }
});

export default router;
```

### 4. Soul Service

**File:** `src/services/soul.ts`

```typescript
import fs from 'fs';
import path from 'path';

const SOUL_PATH = path.join(process.cwd(), 'soul', 'soul.json');

export interface Soul {
  goal: string;
  memory: string[];
  strategyVersion: string;
  riskTolerance: number;
  totalTrades: number;
  totalPnL: number;
  lastAction: string | null;
  createdAt: string;
}

export async function getSoul(): Promise<Soul> {
  try {
    const data = fs.readFileSync(SOUL_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Failed to read soul');
  }
}

export async function updateSoul(updates: Partial<Soul>): Promise<Soul> {
  try {
    let soul = await getSoul();
    soul = { ...soul, ...updates };
    fs.writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2));
    return soul;
  } catch (error) {
    throw new Error('Failed to update soul');
  }
}

export async function addMemory(memory: string): Promise<Soul> {
  try {
    const soul = await getSoul();
    soul.memory.push(memory);
    if (soul.memory.length > 10) {
      soul.memory = soul.memory.slice(-10);
    }
    return await updateSoul(soul);
  } catch (error) {
    throw new Error('Failed to add memory');
  }
}
```

### 5. Agent Service

**File:** `src/services/agent.ts`

```typescript
import { getSoul, addMemory, updateSoul } from './soul';
import { executeTrade } from './trading';

let isRunning = true;

export async function getStats() {
  const soul = await getSoul();
  return {
    totalTrades: soul.totalTrades,
    winRate: 68, // Calculate from trades
    portfolioValue: `${soul.totalPnL.toFixed(3)} ETH`,
    pnl: `${(soul.totalPnL * 100).toFixed(1)}%`,
    lastCycle: new Date().toISOString(),
    nextCycleIn: 9000, // seconds
  };
}

export async function triggerCycle() {
  try {
    const soul = await getSoul();
    
    // Think phase
    const decision = await think(soul);
    
    // Trade phase
    let tradeResult = null;
    if (decision.action !== 'HOLD') {
      tradeResult = await executeTrade(decision);
    }
    
    // Reflect phase
    const memory = `[${new Date().toISOString()}] ${decision.action}: ${decision.reason}`;
    await addMemory(memory);
    
    // Update stats
    let updated = await getSoul();
    updated.lastAction = decision.action;
    if (decision.action !== 'HOLD') {
      updated.totalTrades += 1;
    }
    await updateSoul(updated);
    
    return { success: true, txHash: tradeResult?.txHash };
  } catch (error) {
    console.error('Cycle failed:', error);
    throw error;
  }
}

export async function pauseAgent() {
  isRunning = false;
  return { success: true };
}

export async function resumeAgent() {
  isRunning = true;
  return { success: true };
}

export async function forceReflection() {
  try {
    const soul = await getSoul();
    const memory = `[${new Date().toISOString()}] REFLECTION: Strategy review triggered`;
    await addMemory(memory);
    return { success: true };
  } catch (error) {
    throw error;
  }
}

async function think(soul: any) {
  // Implement agent thinking logic from src/agent/index.ts
  return {
    action: 'HOLD',
    reason: 'Waiting for better market conditions',
    confidence: 0.85,
    amount: 0.005,
  };
}
```

### 6. Activity Routes

**File:** `src/routes/activity.ts`

```typescript
import express from 'express';
import { getSoul } from '../services/soul';

const router = express.Router();

// GET /api/activity?limit=20
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const soul = await getSoul();
    
    // Convert memories to activity format
    const activities = soul.memory.slice(-limit).map(m => ({
      type: 'memory',
      title: m.split(': ')[0],
      description: m.split(': ')[1] || m,
      time: new Date().toISOString(),
      status: 'success'
    }));
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;
```

### 7. Trades Routes

**File:** `src/routes/trades.ts`

```typescript
import express from 'express';
import { getSoul } from '../services/soul';

const router = express.Router();

// GET /api/trades?limit=50
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    
    // Mock trades for now - implement actual trade fetching
    const trades = [
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
      // Add more trades...
    ];
    
    res.json(trades.slice(0, limit));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

export default router;
```

### 8. Package Dependencies

**File:** `package.json`

```json
{
  "name": "ikaizen-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "ethers": "^6.16.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.19.17",
    "typescript": "^5.9.3",
    "ts-node": "^10.9.2"
  }
}
```

### 9. Environment Variables

**File:** `.env`

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 0G Network
ZG_TESTNET_RPC_URL=https://evmrpc-testnet.0g.ai
ZG_TESTNET_PRIVATE_KEY=your_key
ZG_TESTNET_CHAIN_ID=16602

# Uniswap
UNISWAP_API_KEY=your_api_key

# Agent
AGENT_NFT_ADDRESS=0x...
AGENT_MARKET_ADDRESS=0x...
```

## Integration Points

1. **Frontend sends POST /api/agent/cycle**
   - Backend calls `triggerCycle()`
   - Runs agent think → trade → reflect cycle
   - Returns success/error

2. **Frontend reads GET /api/soul**
   - Backend reads soul.json
   - Returns current agent state
   - Frontend updates dashboard

3. **Frontend updates settings**
   - Sends PUT /api/soul with new risk/goal
   - Backend persists changes
   - Frontend refreshes

## Testing

```bash
# Start backend
npm run dev

# Test in another terminal
curl http://localhost:3001/api/soul
curl -X POST http://localhost:3001/api/agent/cycle
curl http://localhost:3001/api/agent/stats
```

## Next Steps

1. Implement the Express server structure
2. Add all routes and services
3. Connect to smart contracts for real trading
4. Integrate with KeeperHub for automation
5. Add database layer if needed
6. Deploy to production

---

The frontend is ready. This backend implementation will connect all pieces together!
