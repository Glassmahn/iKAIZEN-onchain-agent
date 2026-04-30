"use client"

import { motion } from "framer-motion"
import { Brain, Lock, Target, RefreshCw, Clock, ChevronRight, Shield, Database, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const soulData = {
  goal: "Maximize ETH-USDC yield safely with low risk tolerance. Prefer swing trades over day trading. Avoid high-volatility periods.",
  strategyVersion: "1.3",
  riskTolerance: 0.15,
  lastUpdated: "2 hours ago",
  createdAt: "April 24, 2026",
  totalReflections: 47,
  memories: [
    { date: "Apr 28", content: "High volatility detected - reduced position sizes by 20%" },
    { date: "Apr 27", content: "USDC allocation increased after successful swing trade (+8%)" },
    { date: "Apr 26", content: "Learned: RSI oversold conditions correlate with 68% rebound rate" },
    { date: "Apr 25", content: "Initial strategy calibration complete" },
    { date: "Apr 24", content: "Agent soul initialized with conservative parameters" },
  ],
  strategyHistory: [
    { version: "1.3", date: "Apr 28", changes: "Reduced max position size, added volatility filter" },
    { version: "1.2", date: "Apr 27", changes: "Increased USDC allocation target to 60%" },
    { version: "1.1", date: "Apr 26", changes: "Added RSI indicator to decision logic" },
    { version: "1.0", date: "Apr 24", changes: "Initial strategy deployment" },
  ],
  metrics: {
    confidence: 78,
    adaptability: 85,
    riskAwareness: 92,
    marketUnderstanding: 71,
  },
}

export default function SoulPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Soul</h1>
          <p className="text-muted-foreground">View and manage your iKAIZEN&apos;s encrypted soul data</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
          <Lock className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-accent">TEE Protected</span>
        </div>
      </div>

      {/* Soul overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: "Strategy Version", value: soulData.strategyVersion, color: "primary" },
          { icon: Target, label: "Risk Tolerance", value: `${(soulData.riskTolerance * 100).toFixed(0)}%`, color: "accent" },
          { icon: RefreshCw, label: "Total Reflections", value: soulData.totalReflections.toString(), color: "chart-3" },
          { icon: Clock, label: "Last Updated", value: soulData.lastUpdated, color: "muted-foreground" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="memories">Memories</TabsTrigger>
          <TabsTrigger value="strategy">Strategy History</TabsTrigger>
          <TabsTrigger value="storage">Storage Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Trading Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Trading Goal
                </CardTitle>
                <CardDescription>The primary objective guiding your agent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground bg-muted/50 p-4 rounded-lg leading-relaxed">
                  {soulData.goal}
                </p>
              </CardContent>
            </Card>

            {/* Cognitive Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Cognitive Metrics
                </CardTitle>
                <CardDescription>AI performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(soulData.metrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-foreground font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memories">
          <Card>
            <CardHeader>
              <CardTitle>Memory Log</CardTitle>
              <CardDescription>Insights and learnings accumulated over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {soulData.memories.map((memory, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-16 shrink-0">
                      <span className="text-xs font-mono text-muted-foreground">{memory.date}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <p className="text-sm text-foreground">{memory.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Evolution</CardTitle>
              <CardDescription>How your agent&apos;s trading strategy has evolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {soulData.strategyHistory.map((version, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex items-start gap-6 pl-10"
                    >
                      <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                        i === 0 ? "bg-primary border-primary" : "bg-background border-border"
                      }`} />
                      <div className="flex-1 p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-bold ${i === 0 ? "text-primary" : "text-foreground"}`}>
                            v{version.version}
                          </span>
                          <span className="text-xs text-muted-foreground">{version.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{version.changes}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  0G Storage
                </CardTitle>
                <CardDescription>Encrypted soul data location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Storage Address</p>
                  <p className="text-sm font-mono text-foreground break-all">
                    0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Metadata Hash</p>
                  <p className="text-sm font-mono text-foreground break-all">
                    QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-accent" />
                  0G Compute
                </CardTitle>
                <CardDescription>TEE inference configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Compute Endpoint</p>
                  <p className="text-sm font-mono text-foreground">compute-testnet.0g.ai</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Model</p>
                  <p className="text-sm font-mono text-foreground">DeepSeek V3.1</p>
                </div>
                <div className="flex items-center gap-2 p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-sm text-accent">All inference runs in TEE</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Soul Management</h4>
              <p className="text-sm text-muted-foreground">Actions for managing your agent&apos;s soul</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Force Refresh
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Brain className="mr-2 h-4 w-4" />
                Trigger Reflection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
