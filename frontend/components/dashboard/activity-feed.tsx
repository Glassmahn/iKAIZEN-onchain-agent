"use client"

import { motion } from "framer-motion"
import { ArrowRightLeft, Brain, RefreshCw, Zap, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const activities = [
  {
    type: "trade",
    icon: ArrowRightLeft,
    title: "Swap Executed",
    description: "Swapped 0.5 ETH for 1,234.56 USDC",
    time: "2 minutes ago",
    status: "success",
    txHash: "0x1a2b...3c4d",
  },
  {
    type: "reflection",
    icon: Brain,
    title: "Agent Reflection",
    description: "Strategy updated: Increased USDC allocation by 5%",
    time: "1 hour ago",
    status: "info",
  },
  {
    type: "cycle",
    icon: RefreshCw,
    title: "Cycle Completed",
    description: "Full think → trade → reflect cycle finished",
    time: "3 hours ago",
    status: "success",
  },
  {
    type: "trade",
    icon: ArrowRightLeft,
    title: "Swap Executed",
    description: "Swapped 500 USDC for 0.25 ETH",
    time: "6 hours ago",
    status: "success",
    txHash: "0x5e6f...7g8h",
  },
  {
    type: "trigger",
    icon: Zap,
    title: "KeeperHub Trigger",
    description: "Automation triggered agent wake-up",
    time: "6 hours ago",
    status: "info",
  },
  {
    type: "reflection",
    icon: Brain,
    title: "Soul Updated",
    description: "Memory expanded with new market insights",
    time: "9 hours ago",
    status: "info",
  },
]

const statusColors = {
  success: "text-accent",
  info: "text-primary",
  warning: "text-chart-3",
  error: "text-destructive",
}

export function ActivityFeed() {
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
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      {/* Activity list */}
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              activity.type === "trade" && "bg-accent/10",
              activity.type === "reflection" && "bg-primary/10",
              activity.type === "cycle" && "bg-chart-3/10",
              activity.type === "trigger" && "bg-chart-5/10"
            )}>
              <activity.icon className={cn(
                "h-4 w-4",
                activity.type === "trade" && "text-accent",
                activity.type === "reflection" && "text-primary",
                activity.type === "cycle" && "text-chart-3",
                activity.type === "trigger" && "text-chart-5"
              )} />
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
                    href="#"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {activity.txHash}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
