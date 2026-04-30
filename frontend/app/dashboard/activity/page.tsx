"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRightLeft, Brain, RefreshCw, Zap, ExternalLink, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const allActivities = [
  { type: "trade", icon: ArrowRightLeft, title: "Swap Executed", description: "Swapped 0.5 ETH for 1,234.56 USDC", time: "2 minutes ago", status: "success", txHash: "0x1a2b...3c4d" },
  { type: "reflection", icon: Brain, title: "Agent Reflection", description: "Strategy updated: Increased USDC allocation by 5%", time: "1 hour ago", status: "info" },
  { type: "cycle", icon: RefreshCw, title: "Cycle Completed", description: "Full think → trade → reflect cycle finished", time: "3 hours ago", status: "success" },
  { type: "trade", icon: ArrowRightLeft, title: "Swap Executed", description: "Swapped 500 USDC for 0.25 ETH", time: "6 hours ago", status: "success", txHash: "0x5e6f...7g8h" },
  { type: "trigger", icon: Zap, title: "KeeperHub Trigger", description: "Automation triggered agent wake-up", time: "6 hours ago", status: "info" },
  { type: "reflection", icon: Brain, title: "Soul Updated", description: "Memory expanded with new market insights", time: "9 hours ago", status: "info" },
  { type: "cycle", icon: RefreshCw, title: "Cycle Completed", description: "Analysis complete - no trade needed", time: "12 hours ago", status: "success" },
  { type: "trigger", icon: Zap, title: "KeeperHub Trigger", description: "Scheduled automation executed", time: "12 hours ago", status: "info" },
  { type: "trade", icon: ArrowRightLeft, title: "Swap Executed", description: "Swapped 0.3 ETH for 756.00 USDC", time: "18 hours ago", status: "success", txHash: "0x9i0j...1k2l" },
  { type: "reflection", icon: Brain, title: "Strategy Adjustment", description: "Risk parameters recalibrated based on volatility", time: "1 day ago", status: "info" },
]

const typeColors = {
  trade: { bg: "bg-accent/10", text: "text-accent" },
  reflection: { bg: "bg-primary/10", text: "text-primary" },
  cycle: { bg: "bg-chart-3/10", text: "text-chart-3" },
  trigger: { bg: "bg-chart-5/10", text: "text-chart-5" },
}

export default function ActivityPage() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredActivities = allActivities.filter((activity) => {
    const matchesFilter = filter === "all" || activity.type === filter
    const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase()) ||
      activity.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground">Complete history of your agent&apos;s actions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-10 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Actions", value: "156", change: "+12 today" },
          { label: "Trades", value: "47", change: "68% win rate" },
          { label: "Reflections", value: "47", change: "Latest: 1h ago" },
          { label: "Cycles", value: "62", change: "Next: 2h 34m" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-primary">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity list */}
      <Card>
        <CardHeader>
          <Tabs value={filter} onValueChange={setFilter}>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="trade">Trades</TabsTrigger>
                <TabsTrigger value="reflection">Reflections</TabsTrigger>
                <TabsTrigger value="cycle">Cycles</TabsTrigger>
                <TabsTrigger value="trigger">Triggers</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className={cn("p-2.5 rounded-lg shrink-0", typeColors[activity.type as keyof typeof typeColors].bg)}>
                    <activity.icon className={cn("h-5 w-5", typeColors[activity.type as keyof typeof typeColors].text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        activity.status === "success" ? "bg-accent" : "bg-primary"
                      )} />
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      {activity.txHash && (
                        <a
                          href="#"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {activity.txHash}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full capitalize",
                    typeColors[activity.type as keyof typeof typeColors].bg,
                    typeColors[activity.type as keyof typeof typeColors].text
                  )}>
                    {activity.type}
                  </span>
                </motion.div>
              ))
            )}
          </div>

          {filteredActivities.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
