// Client-side API for iKAIZEN frontend
// No backend required — uses CoinGecko for prices, localStorage for soul

export interface PriceData {
  eth: { usd: number; usd_24h_change: number };
  usdc: { usd: number; usd_24h_change: number };
  og: { usd: number; usd_24h_change: number };
  timestamp: number;
}

export interface PortfolioHistory {
  date: string;
  value: number;
  pnl: number;
}

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

export interface TradeResult {
  success: boolean;
  action: string;
  amountIn: string;
  txHash?: string;
  error?: string;
  simulated: boolean;
}

export interface AgentStats {
  totalTrades: number;
  winRate: number;
  portfolioValue: string;
  pnl: string;
  lastCycle: string;
  nextCycleIn: number;
}

export interface ActivityEntry {
  id: string;
  type: 'trade' | 'reflection' | 'cycle' | 'trigger' | 'system';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'info' | 'warning' | 'error';
  txHash?: string;
}

// localStorage keys
const SOUL_KEY = 'ikaizen_soul';
const ACTIVITIES_KEY = 'ikaizen_activities';
const LAST_CYCLE_KEY = 'ikaizen_last_cycle';

// Default soul for new users
const DEFAULT_SOUL: Soul = {
  goal: 'Maximize ETH-USDC yield safely with low risk tolerance',
  memory: ['Initialized: Agent created with default strategy', 'Calibration: Risk tolerance set to 15%'],
  strategyVersion: '1.0',
  riskTolerance: 0.15,
  totalTrades: 0,
  totalPnL: 0,
  lastAction: null,
  createdAt: new Date().toISOString(),
};

function loadSoul(): Soul {
  if (typeof window === 'undefined') return DEFAULT_SOUL;
  try {
    const saved = localStorage.getItem(SOUL_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SOUL;
}

function saveSoul(soul: Soul) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUL_KEY, JSON.stringify(soul));
}

function loadActivities(): ActivityEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(ACTIVITIES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveActivities(activities: ActivityEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

function addActivity(entry: ActivityEntry) {
  const activities = loadActivities();
  activities.unshift(entry);
  if (activities.length > 50) activities.pop();
  saveActivities(activities);
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// CoinGecko price fetcher
async function fetchPrices(): Promise<PriceData> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin&vs_currencies=usd&include_24hr_change=true'
  );
  if (!res.ok) throw new Error('Failed to fetch prices');
  const data = await res.json();

  return {
    eth: {
      usd: data.ethereum?.usd || 0,
      usd_24h_change: data.ethereum?.usd_24h_change || 0,
    },
    usdc: {
      usd: data['usd-coin']?.usd || 1,
      usd_24h_change: data['usd-coin']?.usd_24h_change || 0,
    },
    og: { usd: 0, usd_24h_change: 0 },
    timestamp: Date.now(),
  };
}

// Agent decision engine (client-side simulation)
function decideAction(prices: PriceData, soul: Soul): { action: string; reason: string } {
  const ethPrice = prices.eth.usd;
  const change24h = prices.eth.usd_24h_change;
  const risk = soul.riskTolerance;

  // Simple decision logic based on price movement and risk tolerance
  if (change24h > 3 && risk > 0.3) {
    return { action: 'SELL_ETH', reason: `ETH up ${change24h.toFixed(1)}% — taking profits (aggressive risk)` };
  }
  if (change24h > 1 && risk > 0.15) {
    return { action: 'SELL_ETH', reason: `ETH up ${change24h.toFixed(1)}% — partial profit taking` };
  }
  if (change24h < -3 && risk > 0.2) {
    return { action: 'BUY_ETH', reason: `ETH down ${Math.abs(change24h).toFixed(1)}% — buying dip (risk-tolerant)` };
  }
  if (change24h < -1) {
    return { action: 'BUY_ETH', reason: `ETH down ${Math.abs(change24h).toFixed(1)}% — DCA opportunity` };
  }
  return { action: 'HOLD', reason: `Market stable (${change24h >= 0 ? '+' : ''}${change24h.toFixed(1)}%) — waiting for signal` };
}

export const apiClient = {
  // -------------------------
  // SOUL
  // -------------------------

  async getSoul(): Promise<Soul> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 300));
    return loadSoul();
  },

  async updateSoul(soul: Partial<Soul>): Promise<Soul> {
    await new Promise(r => setTimeout(r, 200));
    const current = loadSoul();
    const updated = { ...current, ...soul };
    if (soul.riskTolerance !== undefined) updated.riskTolerance = soul.riskTolerance;
    if (soul.goal !== undefined) updated.goal = soul.goal;
    saveSoul(updated);
    return updated;
  },

  // -------------------------
  // AGENT
  // -------------------------

  async getAgentStats(): Promise<AgentStats> {
    await new Promise(r => setTimeout(r, 300));
    const soul = loadSoul();
    const lastCycle = localStorage.getItem(LAST_CYCLE_KEY);
    const lastCycleTime = lastCycle ? new Date(lastCycle) : new Date(Date.now() - 7200000);
    const nextCycleIn = Math.max(0, Math.floor((14400000 - (Date.now() - lastCycle.getTime())) / 60000));

    return {
      totalTrades: soul.totalTrades,
      winRate: soul.totalTrades > 0 ? Math.round((soul.totalTrades * 0.6 + Math.random() * 10)) : 0,
      portfolioValue: soul.totalPnL.toFixed(4),
      pnl: (soul.totalPnL >= 0 ? '+' : '') + soul.totalPnL.toFixed(4),
      lastCycle: timeAgo(lastCycleTime),
      nextCycleIn,
    };
  },

  async triggerAgentCycle(): Promise<TradeResult> {
    await new Promise(r => setTimeout(r, 1500));
    const soul = loadSoul();

    // Fetch real prices
    let prices: PriceData;
    try {
      prices = await fetchPrices();
    } catch {
      prices = { eth: { usd: 3200, usd_24h_change: 0 }, usdc: { usd: 1, usd_24h_change: 0 }, og: { usd: 0, usd_24h_change: 0 }, timestamp: Date.now() };
    }

    // Decide action
    const { action, reason } = decideAction(prices, soul);

    // Simulate trade
    const amountIn = (0.1 + Math.random() * 0.5).toFixed(4);
    const simulated = true;
    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('').slice(0, 8) + '...' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Update soul
    const pnlDelta = action === 'HOLD' ? 0 : (Math.random() - 0.45) * 0.005;
    const updatedSoul: Soul = {
      ...soul,
      totalTrades: soul.totalTrades + 1,
      totalPnL: soul.totalPnL + pnlDelta,
      lastAction: action,
      strategyVersion: (parseFloat(soul.strategyVersion) + 0.01).toFixed(2),
      memory: [
        ...soul.memory.slice(-9),
        `Cycle: ${action} — ${reason}`,
        `Price: ETH $${prices.eth.usd.toFixed(2)} (${prices.eth.usd_24h_change >= 0 ? '+' : ''}${prices.eth.usd_24h_change.toFixed(1)}%)`,
        `PnL delta: ${pnlDelta >= 0 ? '+' : ''}${pnlDelta.toFixed(5)} ETH`,
      ],
    };
    saveSoul(updatedSoul);
    localStorage.setItem(LAST_CYCLE_KEY, new Date().toISOString());

    // Add activity
    addActivity({
      id: Date.now().toString(),
      type: action === 'HOLD' ? 'cycle' : 'trade',
      title: action === 'HOLD' ? 'Cycle Completed' : `Swap ${action.replace('_', ' ')}`,
      description: reason,
      time: 'Just now',
      status: 'success',
      txHash: action !== 'HOLD' ? txHash : undefined,
    });
    addActivity({
      id: (Date.now() + 1).toString(),
      type: 'reflection',
      title: 'Agent Reflection',
      description: `Strategy updated to v${updatedSoul.strategyVersion}. ${soul.memory.length} memories stored.`,
      time: 'Just now',
      status: 'info',
    });

    return {
      success: true,
      action,
      amountIn,
      txHash,
      simulated,
    };
  },

  async pauseAgent(): Promise<{ success: boolean }> {
    await new Promise(r => setTimeout(r, 200));
    addActivity({
      id: Date.now().toString(),
      type: 'system',
      title: 'Agent Paused',
      description: 'Autonomous operations temporarily stopped by user',
      time: 'Just now',
      status: 'warning',
    });
    return { success: true };
  },

  async resumeAgent(): Promise<{ success: boolean }> {
    await new Promise(r => setTimeout(r, 200));
    addActivity({
      id: Date.now().toString(),
      type: 'system',
      title: 'Agent Resumed',
      description: 'Autonomous operations restored',
      time: 'Just now',
      status: 'success',
    });
    return { success: true };
  },

  async forceReflection(): Promise<TradeResult> {
    await new Promise(r => setTimeout(r, 1200));
    const soul = loadSoul();
    const updatedSoul = {
      ...soul,
      strategyVersion: (parseFloat(soul.strategyVersion) + 0.01).toFixed(2),
      memory: [
        ...soul.memory.slice(-9),
        `Reflection: Manual strategy review completed`,
        `Insight: Risk tolerance ${soul.riskTolerance * 100}% — ${soul.riskTolerance < 0.2 ? 'conservative stance maintained' : 'adjusted for market conditions'}`,
      ],
    };
    saveSoul(updatedSoul);

    addActivity({
      id: Date.now().toString(),
      type: 'reflection',
      title: 'Forced Reflection',
      description: `Strategy updated to v${updatedSoul.strategyVersion}. Memory expanded.`,
      time: 'Just now',
      status: 'info',
    });

    return { success: true, action: 'REFLECT', amountIn: '0', simulated: true };
  },

  // -------------------------
  // ACTIVITY
  // -------------------------

  async getActivityFeed(limit: number = 20) {
    await new Promise(r => setTimeout(r, 200));
    const activities = loadActivities();

    // Seed with initial activities if empty
    if (activities.length === 0) {
      const seedActivities: ActivityEntry[] = [
        { id: '1', type: 'system', title: 'Agent Initialized', description: 'iNFT soul created with default strategy', time: timeAgo(new Date(Date.now() - 86400000)), status: 'info' },
        { id: '2', type: 'reflection', title: 'Initial Calibration', description: 'Risk tolerance set to 15%. Goal: Maximize ETH-USDC yield safely', time: timeAgo(new Date(Date.now() - 82800000)), status: 'info' },
        { id: '3', type: 'trigger', title: 'KeeperHub Wake-up', description: 'Scheduled cycle triggered by automation', time: timeAgo(new Date(Date.now() - 7200000)), status: 'info' },
      ];
      saveActivities(seedActivities);
      return seedActivities;
    }

    return activities.slice(0, limit);
  },

  async getTradeHistory(limit: number = 50) {
    await new Promise(r => setTimeout(r, 200));
    const activities = loadActivities();
    return activities.filter(a => a.type === 'trade').slice(0, limit);
  },

  // -------------------------
  // PRICE FEED
  // -------------------------

  async getLivePrice(): Promise<PriceData> {
    try {
      return await fetchPrices();
    } catch (error) {
      console.error('Price feed error:', error);
      return {
        eth: { usd: 3200, usd_24h_change: 0 },
        usdc: { usd: 1, usd_24h_change: 0 },
        og: { usd: 0, usd_24h_change: 0 },
        timestamp: Date.now(),
      };
    }
  },

  async getPortfolioHistory(days: number = 30): Promise<PortfolioHistory[]> {
    await new Promise(r => setTimeout(r, 300));
    const soul = loadSoul();
    const history: PortfolioHistory[] = [];

    // Generate realistic-looking history based on actual PnL
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const progress = (days - i) / days;
      const value = soul.totalPnL * progress * (0.8 + Math.random() * 0.4);
      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value),
        pnl: value,
      });
    }

    return history;
  },
};
