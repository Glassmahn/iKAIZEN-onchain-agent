"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Brain, Activity, Wallet, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Portfolio Value",
    value: "2.45 ETH",
    change: "+12.5%",
    trend: "up",
    icon: Wallet,
    subtitle: "$4,892.50 USD",
  },
  {
    title: "Total Trades",
    value: "47",
    change: "+8 this week",
    trend: "up",
    icon: Activity,
    subtitle: "Win rate: 68%",
  },
  {
    title: "Strategy Version",
    value: "v1.3",
    change: "Updated 2h ago",
    trend: "neutral",
    icon: Brain,
    subtitle: "Risk: Conservative",
  },
  {
    title: "Agent Cycles",
    value: "156",
    change: "Next in 2h 34m",
    trend: "neutral",
    icon: RefreshCw,
    subtitle: "Uptime: 99.8%",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
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
