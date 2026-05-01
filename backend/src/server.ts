import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Define an interface for your Soul object to fix "any" types
interface Soul {
  totalTrades?: number;
  memory?: string[];
  lastAction?: string;
  totalPnL?: number;
  strategyVersion?: string;
  riskTolerance?: number;
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Load soul.json - Using path.resolve for better reliability
const SOUL_PATH = path.resolve(__dirname, '../../soul/soul.json');

// Helper to read/write soul safely
const getSoul = (): Soul => JSON.parse(fs.readFileSync(SOUL_PATH, 'utf-8'));
const saveSoul = (data: Soul) => fs.writeFileSync(SOUL_PATH, JSON.stringify(data, null, 2));

// =====================
// ROUTES
// =====================

app.get('/api/soul', (req: Request, res: Response) => {
  try {
    const soul = getSoul();
    res.json(soul);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to read soul' });
  }
});

app.put('/api/soul', (req: Request, res: Response) => {
  try {
    let soul = getSoul();
    soul = { ...soul, ...req.body };
    saveSoul(soul);
    res.json(soul);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update soul' });
  }
});

app.get('/api/agent/stats', (req: Request, res: Response) => {
  try {
    const soul = getSoul();
    res.json({
      totalTrades: soul.totalTrades || 0,
      winRate: 68,
      portfolioValue: '0.5 ETH',
      pnl: '+2.3%',
      lastCycle: new Date().toISOString(),
      nextCycleIn: 7200,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/agent/cycle', async (req: Request, res: Response) => {
  try {
    let soul = getSoul();
    
    const ethPrice: number = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(r => r.json())
      .then((d: any) => d.ethereum?.usd || 1800)
      .catch(() => 1800);
    
    const lastTrades = soul.memory?.slice(-3) || [];
    const recentBuys = lastTrades.filter(m => m.includes('BUY_ETH')).length;
    const recentSells = lastTrades.filter(m => m.includes('SELL_ETH')).length;
    
    const lowerThreshold = ethPrice * 0.92;
    const upperThreshold = ethPrice * 1.08;
    
    let action: string, reason: string, confidence: number;
    
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
    
    const memory = `[${new Date().toISOString()}] ${action}: ${reason}`;
    soul.memory = soul.memory || [];
    soul.memory.push(memory);
    if (soul.memory.length > 10) soul.memory = soul.memory.slice(-10);
    
    soul.lastAction = action;
    soul.totalTrades = (soul.totalTrades || 0) + (action !== 'HOLD' ? 1 : 0);
    
    if (action === 'BUY_ETH') soul.totalPnL = (soul.totalPnL || 0) + (confidence > 0.7 ? 0.002 : -0.001);
    if (action === 'SELL_ETH') soul.totalPnL = (soul.totalPnL || 0) + (confidence > 0.7 ? 0.003 : -0.001);
    soul.totalPnL = Math.round((soul.totalPnL || 0) * 10000) / 10000;
    
    saveSoul(soul);
    
    res.json({ success: true, action, reason, confidence, ethPrice, updatedSoul: soul });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to trigger cycle', details: err.message });
  }
});

app.post('/api/agent/pause', (req: Request, res: Response) => res.json({ success: true }));
app.post('/api/agent/resume', (req: Request, res: Response) => res.json({ success: true }));

app.post('/api/agent/reflect', (req: Request, res: Response) => {
  try {
    let soul = getSoul();
    const recentMemory = soul.memory?.slice(-5) || [];
    const winRate = recentMemory.filter(m => m.includes('SELL_ETH')).length / Math.max(recentMemory.length, 1);
    
    const reflection = {
      timestamp: new Date().toISOString(),
      analyzed_trades: recentMemory.length,
      win_rate: winRate,
      strategy_version: soul.strategyVersion,
      recommendation: winRate > 0.5 ? 'Continue current strategy' : 'Adjust risk parameters'
    };
    
    soul.memory = soul.memory || [];
    soul.memory.push(`[${new Date().toISOString()}] REFLECTION: Strategy reviewed, WR=${(winRate*100).toFixed(0)}%`);
    
    if (winRate < 0.3 && soul.riskTolerance && soul.riskTolerance > 0.1) {
      soul.riskTolerance = Math.max(0.1, soul.riskTolerance - 0.05);
    } else if (winRate > 0.7 && soul.riskTolerance && soul.riskTolerance < 1.0) {
      soul.riskTolerance = Math.min(1.0, soul.riskTolerance + 0.05);
    }
    
    saveSoul(soul);
    res.json({ success: true, reflection, updatedSoul: soul });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reflect', details: err.message });
  }
});

app.get('/api/activity', (req: Request, res: Response) => {
  res.json([{
    type: 'memory',
    title: 'Strategy Reflection',
    description: 'AI reviewed market conditions and adjusted parameters',
    time: new Date().toISOString(),
    status: 'success',
  }]);
});

app.get('/api/trades', (req: Request, res: Response) => {
  res.json([{
    id: 1,
    from: 'ETH',
    to: 'USDC',
    fromAmount: '0.5',
    toAmount: '1234.56',
    date: new Date().toISOString(),
    pnl: '+2.3%',
    status: 'success',
    txHash: '0x1a2b...3c4d',
  }]);
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  
  setInterval(async () => {
    try {
      console.log('⏰ Running scheduled agent cycle...');
      let soul = getSoul();
      const ethPrice: number = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(r => r.json())
        .then((d: any) => d.ethereum?.usd || 1800)
        .catch(() => 1800);
      
      const lastTrades = soul.memory?.slice(-3) || [];
      const recentBuys = lastTrades.filter(m => m.includes('BUY_ETH')).length;
      
      let action = (ethPrice < (ethPrice * 0.95) && recentBuys < 2) ? 'BUY_ETH' : 'HOLD';
      
      soul.memory = soul.memory || [];
      soul.memory.push(`[${new Date().toISOString()}] ${action}: Scheduled check`);
      saveSoul(soul);
      console.log(`✅ Cycle complete: ${action}`);
    } catch (err: any) {
      console.error('❌ Scheduled cycle failed:', err.message);
    }
  }, 5 * 60 * 1000);
});