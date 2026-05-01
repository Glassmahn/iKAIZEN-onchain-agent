"use client"

import { useEffect, useState } from "react"
import { apiClient, PriceData } from "@/lib/api-client"
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface PriceFeedProps {
  compact?: boolean
}

export function LivePriceFeed({ compact = false }: PriceFeedProps) {
  const [prices, setPrices] = useState<PriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchPrices = async () => {
      try {
        setIsLoading(true)
        const data = await apiClient.getLivePrice()
        if (isMounted) {
          setPrices(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch prices")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
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

  const isPriceFeedEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_PRICE_FEED !== 'false';

  if (!isPriceFeedEnabled) {
    return null
  }

  if (error) {
    return (
      <motion.div
        className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-700 dark:text-yellow-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="font-medium">Price Feed Error:</p>
        <p>{error}</p>
        <p className="text-xs mt-1 opacity-75">Check: NEXT_PUBLIC_COINGECKO_API_URL env var is set</p>
      </motion.div>
    )
  }

  if (isLoading || !prices) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-24" />
      </div>
    )
  }

  const PriceCard = ({ label, price, change }: { label: string; price: number; change: number }) => {
    const isPositive = change >= 0

    return (
      <motion.div
        className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}
        whileHover={{ scale: 1.05 }}
      >
        <div>
          <p className="text-muted-foreground font-medium">{label}</p>
          <p className="text-foreground font-semibold">${price.toFixed(2)}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isPositive
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownLeft className="w-3 h-3" />
          )}
          <span className="text-xs font-medium">{Math.abs(change).toFixed(2)}%</span>
        </div>
      </motion.div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <PriceCard label="ETH" price={prices.eth.usd} change={prices.eth.usd_24h_change} />
        <PriceCard label="USDC" price={prices.usdc.usd} change={prices.usdc.usd_24h_change} />
        <PriceCard label="0G" price={prices.og.usd} change={prices.og.usd_24h_change} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border grid grid-cols-3 gap-4"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">ETH</p>
          <p className="text-lg font-bold text-foreground">${prices.eth.usd.toFixed(2)}</p>
          <p
            className={`text-xs font-medium flex items-center gap-1 ${
              prices.eth.usd_24h_change >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {prices.eth.usd_24h_change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownLeft className="w-3 h-3" />
            )}
            {Math.abs(prices.eth.usd_24h_change).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="p-2 rounded-lg bg-yellow-500/10">
          <TrendingUp className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">USDC</p>
          <p className="text-lg font-bold text-foreground">${prices.usdc.usd.toFixed(2)}</p>
          <p
            className={`text-xs font-medium flex items-center gap-1 ${
              prices.usdc.usd_24h_change >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {prices.usdc.usd_24h_change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownLeft className="w-3 h-3" />
            )}
            {Math.abs(prices.usdc.usd_24h_change).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <TrendingUp className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">0G Token</p>
          <p className="text-lg font-bold text-foreground">${prices.og.usd.toFixed(4)}</p>
          <p
            className={`text-xs font-medium flex items-center gap-1 ${
              prices.og.usd_24h_change >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {prices.og.usd_24h_change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownLeft className="w-3 h-3" />
            )}
            {Math.abs(prices.og.usd_24h_change).toFixed(2)}%
          </p>
        </div>
      </div>

      <p className="col-span-3 text-xs text-muted-foreground text-center mt-2">
        Updated: {new Date(prices.timestamp).toLocaleTimeString()}
      </p>
    </motion.div>
  )
}
