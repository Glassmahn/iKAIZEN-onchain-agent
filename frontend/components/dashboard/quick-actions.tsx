"use client"

import { motion } from "framer-motion"
import {
  Play,
  Pause,
  RefreshCw,
  Settings,
  Zap,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAgent } from "@/lib/agent-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const { triggerCycle, pauseAgent, resumeAgent, forceReflection, error } =
    useAgent()

  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const router = useRouter()

  // Get contract address from env
  const agentNftAddress = process.env.NEXT_PUBLIC_AGENT_NFT_ADDRESS

  const handleTriggerCycle = async () => {
    setIsLoading("cycle")
    try {
      await triggerCycle()
    } finally {
      setIsLoading(null)
    }
  }

  const handleTogglePause = async () => {
    setIsLoading("pause")
    try {
      if (isPaused) {
        await resumeAgent()
      } else {
        await pauseAgent()
      }
      setIsPaused(!isPaused)
    } finally {
      setIsLoading(null)
    }
  }

  const handleForceReflection = async () => {
    setIsLoading("reflect")
    try {
      await forceReflection()
    } finally {
      setIsLoading(null)
    }
  }

  const handleEditParameters = () => {
    router.push("/dashboard/settings")
  }

  const actions = [
    {
      icon: Play,
      label: "Trigger Cycle",
      description: "Manually start a think-trade-reflect cycle",
      variant: "default" as const,
      primary: true,
      onClick: handleTriggerCycle,
      loading: isLoading === "cycle",
    },
    {
      icon: isPaused ? Play : Pause,
      label: isPaused ? "Resume Agent" : "Pause Agent",
      description: isPaused
        ? "Resume autonomous operations"
        : "Temporarily stop autonomous operations",
      variant: "outline" as const,
      onClick: handleTogglePause,
      loading: isLoading === "pause",
    },
    {
      icon: RefreshCw,
      label: "Force Reflection",
      description: "Trigger immediate strategy review",
      variant: "outline" as const,
      onClick: handleForceReflection,
      loading: isLoading === "reflect",
    },
    {
      icon: Settings,
      label: "Edit Parameters",
      description: "Modify risk tolerance and goals",
      variant: "outline" as const,
      onClick: handleEditParameters,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <Zap className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Quick Actions
          </h3>
          <p className="text-sm text-muted-foreground">
            Manual agent controls
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant}
            onClick={action.onClick}
            disabled={action.loading}
            className={`w-full justify-start h-auto py-4 px-4 ${
              action.primary
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-4 w-full">
              <div
                className={`p-2 rounded-lg ${
                  action.primary ? "bg-primary-foreground/10" : "bg-muted"
                }`}
              >
                {action.loading ? (
                  <RefreshCw
                    className={`h-4 w-4 animate-spin ${
                      action.primary
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                ) : (
                  <action.icon
                    className={`h-4 w-4 ${
                      action.primary
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-medium ${
                    action.primary
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {action.label}
                </p>
                <p
                  className={`text-xs ${
                    action.primary
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                className={`h-4 w-4 ${
                  action.primary
                    ? "text-primary-foreground/50"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </Button>
        ))}
      </div>

      {/* Status */}
      <div
        className={`mt-6 p-3 rounded-lg border ${
          isPaused
            ? "bg-destructive/10 border-destructive/30"
            : "bg-accent/10 border-accent/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isPaused ? "bg-destructive" : "bg-accent"
            } ${!isPaused && "animate-pulse"}`}
          />
          <span
            className={`text-sm font-medium ${
              isPaused ? "text-destructive" : "text-accent"
            }`}
          >
            {isPaused ? "Agent is paused" : "Agent is running"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {isPaused
            ? "Resume to enable autonomous trading"
            : "Next cycle in 2h 34m"}
        </p>

        {!isPaused && (
          <p className="text-xs text-muted-foreground mt-1">
            Automatic cycle scheduled for 2h 34m from now
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
    </motion.div>
  )
}