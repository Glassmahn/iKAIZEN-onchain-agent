"use client"

import { motion } from "framer-motion"
import { Brain, Target, Lock, RefreshCw, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAgent } from "@/lib/agent-context"
import { useRouter } from "next/navigation"

export function AgentSoul() {
  const { soul, loading, refreshSoul } = useAgent()
  const router = useRouter()

  const riskPercent = (soul?.riskTolerance || 0.15) * 100

  const recentMemories = soul?.memory?.slice(-3) || []

  const confidence = Math.min(95, 50 + (soul?.totalTrades || 0) * 2)
  const adaptability = Math.min(95, 60 + (soul?.totalTrades || 0) * 3)
  const riskAwareness = Math.min(95, 70 + (1 - (soul?.riskTolerance || 0.15)) * 20)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
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
            <h3 className="text-lg font-semibold text-foreground">
              Agent Soul
            </h3>
            <p className="text-sm text-muted-foreground">
              Encrypted on 0G Storage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-accent">
            TEE Protected
          </span>
        </div>
      </div>

      {/* Goal */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Trading Goal
          </span>
        </div>
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          {soul?.goal || "Set your agent's goal to begin trading"}
        </p>
      </div>

      {/* Strategy info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">
            Strategy Version
          </p>
          <p className="text-lg font-bold text-primary">
            v{soul?.strategyVersion || "1.0"}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">
            Risk Tolerance
          </p>
          <p className="text-lg font-bold text-foreground">
            {riskPercent.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Cognitive metrics */}
      <div className="space-y-4 mb-6">
        <p className="text-sm font-medium text-foreground">
          Cognitive Metrics
        </p>
        {[
          { key: "confidence", value: confidence, label: "Confidence" },
          { key: "adaptability", value: adaptability, label: "Adaptability" },
          { key: "riskAwareness", value: riskAwareness, label: "Risk Awareness" },
        ].map(metric => (
          <div key={metric.key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="text-foreground font-medium">
                {metric.value}%
              </span>
            </div>
            <Progress value={metric.value} className="h-1.5" />
          </div>
        ))}
      </div>

      {/* Recent memories */}
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-3">
          Recent Memories
        </p>
        <div className="space-y-2">
          {recentMemories.length > 0 ? (
            recentMemories.map((memory, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                <span>{memory}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No memories yet. Trigger your first cycle.
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => router.push("/dashboard/soul")}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          View Full Soul
        </Button>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {soul?.totalTrades || 0} trades • {soul?.memory?.length || 0} memories
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-1"
            onClick={refreshSoul}
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
