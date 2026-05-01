'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Soul, AgentStats, apiClient } from '@/lib/api-client';

interface AgentContextType {
  soul: Soul | null;
  stats: AgentStats | null;
  loading: boolean;
  error: string | null;
  refreshSoul: () => Promise<void>;
  refreshStats: () => Promise<void>;
  updateSoulRiskTolerance: (risk: number) => Promise<void>;
  updateSoulGoal: (goal: string) => Promise<void>;
  triggerCycle: () => Promise<void>;
  pauseAgent: () => Promise<void>;
  resumeAgent: () => Promise<void>;
  forceReflection: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [soul, setSoul] = useState<Soul | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSoul = async () => {
    try {
      setError(null);
      const data = await apiClient.getSoul();
      setSoul(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch soul';
      setError(message);
    }
  };

  const refreshStats = async () => {
    try {
      setError(null);
      const data = await apiClient.getAgentStats();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(message);
    }
  };

  const updateSoulRiskTolerance = async (risk: number) => {
    try {
      setError(null);
      const updated = await apiClient.updateSoul({ riskTolerance: risk });
      setSoul(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update soul';
      setError(message);
      throw err;
    }
  };

  const updateSoulGoal = async (goal: string) => {
    try {
      setError(null);
      const updated = await apiClient.updateSoul({ goal });
      setSoul(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update soul';
      setError(message);
      throw err;
    }
  };

  const triggerCycle = async () => {
    try {
      setError(null);
      await apiClient.triggerAgentCycle();
      await refreshSoul();
      await refreshStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to trigger cycle';
      setError(message);
      throw err;
    }
  };

  const pauseAgent = async () => {
    try {
      setError(null);
      await apiClient.pauseAgent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to pause agent';
      setError(message);
      throw err;
    }
  };

  const resumeAgent = async () => {
    try {
      setError(null);
      await apiClient.resumeAgent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resume agent';
      setError(message);
      throw err;
    }
  };

  const forceReflection = async () => {
    try {
      setError(null);
      await apiClient.forceReflection();
      await refreshSoul();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to force reflection';
      setError(message);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshSoul(), refreshStats()]);
      setLoading(false);
    };
    init();
  }, []);

  // Auto-refresh every 30 seconds (configurable via env)
  useEffect(() => {
    const refreshInterval = parseInt(process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL || '30000', 10);
    const interval = setInterval(() => {
      refreshSoul();
      refreshStats();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <AgentContext.Provider
      value={{
        soul,
        stats,
        loading,
        error,
        refreshSoul,
        refreshStats,
        updateSoulRiskTolerance,
        updateSoulGoal,
        triggerCycle,
        pauseAgent,
        resumeAgent,
        forceReflection,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}
