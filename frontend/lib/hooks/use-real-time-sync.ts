"use client"

import { useEffect, useState, useCallback } from "react"
import { apiClient, Soul, AgentStats, PriceData } from "@/lib/api-client"

interface UseRealTimeSyncOptions {
  autoRefreshInterval?: number
}

export function useRealTimeSync(options: UseRealTimeSyncOptions = {}) {
  const { autoRefreshInterval = 30000 } = options

  const [soul, setSoul] = useState<Soul | null>(null)
  const [stats, setStats] = useState<AgentStats | null>(null)
  const [prices, setPrices] = useState<PriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [soulData, statsData, pricesData] = await Promise.all([
        apiClient.getSoul().catch(() => null),
        apiClient.getAgentStats().catch(() => null),
        apiClient.getLivePrice().catch(() => null),
      ])

      if (soulData) setSoul(soulData)
      if (statsData) setStats(statsData)
      if (pricesData) setPrices(pricesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(refreshData, autoRefreshInterval)
    return () => clearInterval(interval)
  }, [refreshData, autoRefreshInterval])

  return {
    soul,
    stats,
    prices,
    isLoading,
    error,
    refreshData,
  }
}

export function usePriceUpdate() {
  const [prices, setPrices] = useState<PriceData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchPrices = async () => {
      try {
        const data = await apiClient.getLivePrice()
        if (isMounted) {
          setPrices(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch prices")
        }
      }
    }

    fetchPrices()

    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { prices, error }
}
