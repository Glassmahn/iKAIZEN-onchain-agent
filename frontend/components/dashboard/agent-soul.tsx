"use client"

import { motion } from "framer-motion"
import { Brain, Shield, Target, Lock, RefreshCw, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const soulData = {
  goal: "Maximize ETH-USDC yield safely with low risk tolerance",
  strategyVersion: "1.3",
  riskTolerance: 0.15,
  lastUpdated: "2 hours ago",
  memories: [
    "High volatility detected on Apr 27 - reduced position sizes",
    "USDC allocation increased after successful swing trade",
    "Learned: RSI oversold conditions correlate with 68% rebound rate",
  ],
  metrics: {
    confidence: 78,
    adaptability: 85,
    riskAwareness: 92,
  },
}

export function AgentSoul() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Agent Soul</h3>
            <p className="text-sm text-muted-foreground">Encrypted on 0G Storage</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-accent">TEE Protected</span>
        </div>
      </div>

      {/* Goal */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Trading Goal</span>
        </div>
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          {soulData.goal}
        </p>
      </div>

      {/* Strategy info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Strategy Version</p>
          <p className="text-lg font-bold text-primary">{soulData.strategyVersion}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Risk Tolerance</p>
          <p className="text-lg font-bold text-foreground">{(soulData.riskTolerance * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Cognitive metrics */}
      <div className="space-y-4 mb-6">
        <p className="text-sm font-medium text-foreground">Cognitive Metrics</p>
        {Object.entries(soulData.metrics).map(([key, value]) => (
          <div key={key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="text-foreground font-medium">{value}%</span>
            </div>
            <Progress value={value} className="h-1.5" />
          </div>
        ))}
      </div>

      {/* Recent memories */}
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-3">Recent Memories</p>
        <div className="space-y-2">
          {soulData.memories.map((memory, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
              <span>{memory}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Last updated: {soulData.lastUpdated}
        </span>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>
    </motion.div>
  )
}
