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
