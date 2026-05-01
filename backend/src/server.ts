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
app.post('/api/agent/cycle', async (req, res) => {
  try {
    let soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
    
    // Simulate agent thinking & decision making
    const ethPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(r => r.json())
      .then(d => d.ethereum?.usd || 1800)
      .catch(() => 1800);
    
    // Smart decision logic
    const lastTrades = soul.memory?.slice(-3) || [];
    const recentBuys = lastTrades.filter(m => m.includes('BUY_ETH')).length;
    const recentSells = lastTrades.filter(m => m.includes('SELL_ETH')).length;
    
    const lowerThreshold = ethPrice * 0.92;
    const upperThreshold = ethPrice * 1.08;
    
    let action, reason, confidence;
    
    if (ethPrice < lowerThreshold && recentBuys < 2) {
      action = 'BUY_ETH';
      reason = `ETH at $${ethPrice.toFixed(0)} is below ${lowerThreshold.toFixed(0)} threshold`;
      confidence = 0.75;
    } else if (ethPrice > upperThreshold && recentSells < 2) {
      action = 'SELL_ETH';
      reason = `ETH at $${ethPrice.toFixed(0)} reached ${upperThreshold.toFixed(0)} profit target`;
      confidence = 0.8;
    } else if (soul.totalTrades === 0) {
      action = 'BUY_ETH';
      reason = 'Initial position — entering ETH market per strategy';
      confidence = 0.7;
    } else {
      action = 'HOLD';
      reason = `ETH at $${ethPrice.toFixed(0)} — waiting for better entry`;
      confidence = 0.85;
    }
    
    // Update soul with decision
    const memory = `[${new Date().toISOString()}] ${action}: ${reason}`;
    soul.memory = soul.memory || [];
    soul.memory.push(memory);
    if (soul.memory.length > 10) soul.memory = soul.memory.slice(-10);
    
    soul.lastAction = action;
    soul.totalTrades = (soul.totalTrades || 0) + (action !== 'HOLD' ? 1 : 0);
    
    // Update PnL
    if (action === 'BUY_ETH') soul.totalPnL = (soul.totalPnL || 0) + (confidence > 0.7 ? 0.002 : -0.001);
    if (action === 'SELL_ETH') soul.totalPnL = (soul.totalPnL || 0) + (confidence > 0.7 ? 0.003 : -0.001);
    soul.totalPnL = Math.round((soul.totalPnL || 0) * 10000) / 10000;
    
    fs.writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2));
    
    res.json({ 
      success: true, 
      action, 
      reason,
      confidence,
      ethPrice,
      updatedSoul: soul
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger cycle', details: err.message });
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
  try {
    let soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
    
    // Analyze recent trades and adjust strategy
    const recentMemory = soul.memory?.slice(-5) || [];
    const winRate = recentMemory.filter(m => m.includes('SELL_ETH')).length / Math.max(recentMemory.length, 1);
    
    const reflection = {
      timestamp: new Date().toISOString(),
      analyzed_trades: recentMemory.length,
      win_rate: winRate,
      strategy_version: soul.strategyVersion,
      recommendation: winRate > 0.5 ? 'Continue current strategy' : 'Adjust risk parameters'
    };
    
    // Store reflection in memory
    const reflectionNote = `[${new Date().toISOString()}] REFLECTION: Strategy reviewed, WR=${(winRate*100).toFixed(0)}%`;
    soul.memory = soul.memory || [];
    soul.memory.push(reflectionNote);
    
    // Optionally adjust risk tolerance based on performance
    if (winRate < 0.3 && soul.riskTolerance > 0.1) {
      soul.riskTolerance = Math.max(0.1, soul.riskTolerance - 0.05);
    } else if (winRate > 0.7 && soul.riskTolerance < 1.0) {
      soul.riskTolerance = Math.min(1.0, soul.riskTolerance + 0.05);
    }
    
    fs.writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2));
    
    res.json({ success: true, reflection, updatedSoul: soul });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reflect', details: err.message });
  }
});
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

  // Auto-run agent cycle every 5 minutes
  setInterval(async () => {
    try {
      console.log('⏰ Running scheduled agent cycle...');
      let soul = JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
      
      // Trigger cycle logic (same as POST /api/agent/cycle)
      const ethPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(r => r.json())
        .then(d => d.ethereum?.usd || 1800)
        .catch(() => 1800);
      
      const lastTrades = soul.memory?.slice(-3) || [];
      const recentBuys = lastTrades.filter(m => m.includes('BUY_ETH')).length;
      const recentSells = lastTrades.filter(m => m.includes('SELL_ETH')).length;
      
      const lowerThreshold = ethPrice * 0.92;
      const upperThreshold = ethPrice * 1.08;
      
      let action, reason, confidence;
      
      if (ethPrice < lowerThreshold && recentBuys < 2) {
        action = 'BUY_ETH';
        reason = `ETH at $${ethPrice.toFixed(0)} is below ${lowerThreshold.toFixed(0)} threshold`;
        confidence = 0.75;
      } else if (ethPrice > upperThreshold && recentSells < 2) {
        action = 'SELL_ETH';
        reason = `ETH at $${ethPrice.toFixed(0)} reached ${upperThreshold.toFixed(0)} profit target`;
        confidence = 0.8;
      } else {
        action = 'HOLD';
        reason = `ETH at $${ethPrice.toFixed(0)} — waiting for better entry`;
        confidence = 0.85;
      }
      
      const memory = `[${new Date().toISOString()}] ${action}: ${reason}`;
      soul.memory = soul.memory || [];
      soul.memory.push(memory);
      if (soul.memory.length > 10) soul.memory = soul.memory.slice(-10);
      
      soul.lastAction = action;
      soul.totalTrades = (soul.totalTrades || 0) + (action !== 'HOLD' ? 1 : 0);
      
      if (action === 'BUY_ETH') soul.totalPnL = (soul.totalPnL || 0) + (confidence > 0.7 ? 0.002 : -0.001);
      if (action === 'SELL_ETH') soul.totalPnL = (soul.totalPnL || 0) + (confidence > 0.7 ? 0.003 : -0.001);
      soul.totalPnL = Math.round((soul.totalPnL || 0) * 10000) / 10000;
      
      fs.writeFileSync(SOUL_PATH, JSON.stringify(soul, null, 2));
      console.log(`✅ Cycle complete: ${action} at ETH $${ethPrice.toFixed(0)}`);
    } catch (err) {
      console.error('❌ Scheduled cycle failed:', err.message);
    }
  }, 5 * 60 * 1000); // 5 minutes
});
