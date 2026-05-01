"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRightLeft, Brain, RefreshCw, Zap, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { apiClient, ActivityEntry } from "@/lib/api-client"

const typeIcons: Record<ActivityEntry['type'], typeof ArrowRightLeft> = {
  trade: ArrowRightLeft,
  reflection: Brain,
  cycle: RefreshCw,
  trigger: Zap,
  system: RefreshCw,
}

const statusColors = {
  success: "text-accent",
  info: "text-primary",
  warning: "text-chart-3",
  error: "text-destructive",
}

const typeBgColors: Record<ActivityEntry['type'], string> = {
  trade: "bg-accent/10 text-accent",
  reflection: "bg-primary/10 text-primary",
  cycle: "bg-chart-3/10 text-chart-3",
  trigger: "bg-chart-5/10 text-chart-5",
  system: "bg-muted text-muted-foreground",
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.getActivityFeed(20).then(data => {
      setActivities(data)
      setLoading(false)
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Activity Feed</h3>
          <p className="text-sm text-muted-foreground">Real-time agent actions</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() => {
            setLoading(true)
            apiClient.getActivityFeed(20).then(data => {
              setActivities(data)
              setLoading(false)
            })
          }}
        >
          Refresh
        </Button>
      </div>

      {/* Activity list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-3 bg-muted rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No activity yet</p>
          <p className="text-xs text-muted-foreground mt-1">Trigger your first cycle to see activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const Icon = typeIcons[activity.type]
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className={cn("p-2 rounded-lg shrink-0", typeBgColors[activity.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[activity.status].replace("text-", "bg-"))} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    {activity.txHash && (
                      <a
                        href="https://chainscan-galileo.0g.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {activity.txHash}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
