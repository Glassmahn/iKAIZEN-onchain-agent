"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Brain, Activity, Wallet, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgent } from "@/lib/agent-context"

export function StatsCards() {
  const { soul, stats, loading } = useAgent()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-muted mb-4" />
            <div className="h-3 bg-muted rounded w-24 mb-2" />
            <div className="h-7 bg-muted rounded w-32 mb-1" />
            <div className="h-3 bg-muted rounded w-20" />
          </div>
        ))}
      </div>
    )
  }

  const portfolioValue = soul?.totalPnL ?? 0
  const totalTrades = soul?.totalTrades ?? 0
  const strategyVersion = soul?.strategyVersion ?? "1.0"
  const riskLevel = !soul ? "Not set" : soul.riskTolerance < 0.2 ? "Conservative" : soul.riskTolerance < 0.5 ? "Moderate" : "Aggressive"

  const cards = [
    {
      title: "Portfolio Value",
      value: `${portfolioValue >= 0 ? '+' : ''}${portfolioValue.toFixed(4)} ETH`,
      change: portfolioValue > 0 ? `+$${(portfolioValue * 3200).toFixed(2)}` : "No trades yet",
      trend: portfolioValue > 0 ? "up" as const : portfolioValue < 0 ? "down" as const : "neutral" as const,
      icon: Wallet,
      subtitle: `~$${(portfolioValue * 3200).toFixed(2)} USD`,
    },
    {
      title: "Total Trades",
      value: totalTrades.toString(),
      change: stats?.winRate ? `${stats.winRate}% win rate` : "Start trading",
      trend: totalTrades > 0 ? "up" as const : "neutral" as const,
      icon: Activity,
      subtitle: `${stats?.winRate || 0}% win rate`,
    },
    {
      title: "Strategy Version",
      value: `v${strategyVersion}`,
      change: soul?.lastAction ? `Last: ${soul.lastAction}` : "Not yet run",
      trend: "neutral" as const,
      icon: Brain,
      subtitle: `Risk: ${riskLevel}`,
    },
    {
      title: "Agent Status",
      value: stats ? "Active" : "Idle",
      change: stats?.lastCycle ? stats.lastCycle : "No cycles",
      trend: stats ? "neutral" as const : "neutral" as const,
      icon: RefreshCw,
      subtitle: stats ? `${stats.nextCycleIn}m to next` : "Trigger a cycle",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={cn(
            "p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors",
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            {stat.trend === "up" && (
              <div className="flex items-center gap-1 text-xs font-medium text-accent">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </div>
            )}
            {stat.trend === "down" && (
              <div className="flex items-center gap-1 text-xs font-medium text-destructive">
                <TrendingDown className="h-3 w-3" />
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
