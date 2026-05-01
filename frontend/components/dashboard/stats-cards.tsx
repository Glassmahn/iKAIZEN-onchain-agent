"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Brain, Activity, Wallet, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgent } from "@/lib/agent-context"

export function StatsCards() {
  const { soul, stats, loading } = useAgent()

  // Calculate derived values from soul
  const portfolioValue = soul?.totalPnL || 0
  const totalTrades = soul?.totalTrades || 0
  const strategyVersion = soul?.strategyVersion || "v1.0"
  const riskLevel = soul && soul.riskTolerance < 0.2 ? "Conservative" : soul && soul.riskTolerance < 0.5 ? "Moderate" : "Aggressive"

  const cards = [
    {
      title: "Portfolio Value",
      value: `${portfolioValue.toFixed(3)} ETH`,
      change: portfolioValue > 0 ? `+${(portfolioValue * 100).toFixed(1)}%` : `${(portfolioValue * 100).toFixed(1)}%`,
      trend: portfolioValue > 0 ? "up" : portfolioValue < 0 ? "down" : "neutral",
      icon: Wallet,
      subtitle: `$${(portfolioValue * 2000).toFixed(2)} USD`, // Rough ETH price
    },
    {
      title: "Total Trades",
      value: totalTrades.toString(),
      change: "+8 this week",
      trend: "up" as const,
      icon: Activity,
      subtitle: `Win rate: ${stats?.winRate || 68}%`,
    },
    {
      title: "Strategy Version",
      value: `v${strategyVersion}`,
      change: "Updated recently",
      trend: "neutral" as const,
      icon: Brain,
      subtitle: `Risk: ${riskLevel}`,
    },
    {
      title: "Agent Status",
      value: "Active",
      change: "Running 24/7",
      trend: "neutral" as const,
      icon: RefreshCw,
      subtitle: "Uptime: 99.8%",
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={cn(
            "p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors",
            loading && "animate-pulse"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            {stat.trend !== "neutral" && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-accent" : "text-destructive"
                )}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            )}
            {stat.trend === "neutral" && (
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
