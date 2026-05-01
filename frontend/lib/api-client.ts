// API client for iKAIZEN backend (Next.js App Router)

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

export const apiClient = {
  // -------------------------
  // SOUL
  // -------------------------

  async getSoul(): Promise<Soul> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/soul`);

    if (!res.ok) {
      throw new Error("Failed to fetch soul");
    }

    return res.json();
  },

  async updateSoul(soul: Partial<Soul>): Promise<Soul> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/soul`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(soul),
    });

    if (!res.ok) {
      throw new Error("Failed to update soul");
    }

    return res.json();
  },

  // -------------------------
  // AGENT
  // -------------------------

  async getAgentStats(): Promise<AgentStats> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/agent/stats`);

    if (!res.ok) {
      throw new Error("Failed to fetch agent stats");
    }

    return res.json();
  },

  async triggerAgentCycle(): Promise<TradeResult> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/agent/cycle`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to trigger cycle");
    }

    return res.json();
  },

  async pauseAgent(): Promise<{ success: boolean }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/agent/pause`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to pause agent");
    }

    return res.json();
  },

  async resumeAgent(): Promise<{ success: boolean }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/agent/resume`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to resume agent");
    }

    return res.json();
  },

  async forceReflection(): Promise<TradeResult> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/agent/reflect`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to force reflection");
    }

    return res.json();
  },

  // -------------------------
  // ACTIVITY
  // -------------------------

  async getActivityFeed(limit: number = 20) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/activity?limit=${limit}`);

    if (!res.ok) {
      throw new Error("Failed to fetch activity");
    }

    return res.json();
  },

  async getTradeHistory(limit: number = 50) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/trades?limit=${limit}`);

    if (!res.ok) {
      throw new Error("Failed to fetch trades");
    }

    return res.json();
  },

  // -------------------------
  // PRICE FEED
  // -------------------------

  async getLivePrice(): Promise<PriceData> {
    try {
      const ids = 'ethereum,usd-coin,0g';
      const apiUrl = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
      const res = await fetch(
        `${apiUrl}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!res.ok) throw new Error('Failed to fetch prices');

      const data = await res.json();
      return {
        eth: { usd: data.ethereum?.usd || 0, usd_24h_change: data.ethereum?.usd_24h_change || 0 },
        usdc: { usd: data['usd-coin']?.usd || 0, usd_24h_change: data['usd-coin']?.usd_24h_change || 0 },
        og: { usd: data['0g']?.usd || 0, usd_24h_change: data['0g']?.usd_24h_change || 0 },
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Price feed error:', error);
      throw error;
    }
  },

  async getPortfolioHistory(days: number = 30): Promise<PortfolioHistory[]> {
    const res = await fetch(`/api/portfolio-history?days=${days}`);

    if (!res.ok) {
      throw new Error('Failed to fetch portfolio history');
    }

    return res.json();
  },
};