"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, Zap, Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [autoTrade, setAutoTrade] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [riskTolerance, setRiskTolerance] = useState([15])
  const [cycleInterval, setCycleInterval] = useState("4")

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your iKAIZEN agent</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="agent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="agent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Agent Configuration
              </CardTitle>
              <CardDescription>Core trading parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk tolerance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Risk Tolerance</Label>
                  <span className="text-sm font-medium text-primary">{riskTolerance[0]}%</span>
                </div>
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Trading pair */}
              <div className="space-y-2">
                <Label>Primary Trading Pair</Label>
                <Select defaultValue="eth-usdc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth-usdc">ETH / USDC</SelectItem>
                    <SelectItem value="eth-usdt">ETH / USDT</SelectItem>
                    <SelectItem value="wbtc-usdc">WBTC / USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max position size */}
              <div className="space-y-2">
                <Label>Max Position Size (ETH)</Label>
                <Input type="number" placeholder="1.0" defaultValue="1.0" />
                <p className="text-xs text-muted-foreground">Maximum amount per trade</p>
              </div>

              {/* Auto-trade toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Autonomous Trading</p>
                  <p className="text-sm text-muted-foreground">Allow agent to execute trades automatically</p>
                </div>
                <Switch checked={autoTrade} onCheckedChange={setAutoTrade} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                KeeperHub Automation
              </CardTitle>
              <CardDescription>Configure automatic agent cycles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cycle interval */}
              <div className="space-y-2">
                <Label>Cycle Interval</Label>
                <Select value={cycleInterval} onValueChange={setCycleInterval}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every 1 hour</SelectItem>
                    <SelectItem value="2">Every 2 hours</SelectItem>
                    <SelectItem value="4">Every 4 hours</SelectItem>
                    <SelectItem value="6">Every 6 hours</SelectItem>
                    <SelectItem value="12">Every 12 hours</SelectItem>
                    <SelectItem value="24">Every 24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How often KeeperHub triggers agent cycles</p>
              </div>

              {/* Next cycle */}
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">Next scheduled cycle</p>
                    <p className="text-sm text-muted-foreground">In 2 hours 34 minutes</p>
                  </div>
                </div>
              </div>

              {/* x402 payments */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">x402 Autonomous Payments</p>
                  <p className="text-sm text-muted-foreground">Agent pays for its own execution</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Manage alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Trade Executed", description: "When a swap is completed", defaultChecked: true },
                { label: "Cycle Completed", description: "When a full agent cycle finishes", defaultChecked: true },
                { label: "Strategy Updated", description: "When the agent reflects and updates", defaultChecked: true },
                { label: "Low Balance", description: "When wallet balance is low", defaultChecked: true },
                { label: "Error Alerts", description: "When something goes wrong", defaultChecked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Security Settings
              </CardTitle>
              <CardDescription>Protect your agent and funds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* TEE status */}
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">TEE Protection Active</p>
                    <p className="text-sm text-muted-foreground">All inference runs in trusted execution environment</p>
                  </div>
                </div>
              </div>

              {/* Emergency stop */}
              <div className="space-y-2">
                <Label>Emergency Stop</Label>
                <p className="text-sm text-muted-foreground mb-3">Immediately halt all agent operations</p>
                <Button variant="destructive">Emergency Stop Agent</Button>
              </div>

              {/* Spending limit */}
              <div className="space-y-2">
                <Label>Daily Spending Limit (ETH)</Label>
                <Input type="number" placeholder="2.0" defaultValue="2.0" />
                <p className="text-xs text-muted-foreground">Maximum ETH value tradable per day</p>
              </div>

              {/* Whitelist */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Token Whitelist</p>
                  <p className="text-sm text-muted-foreground">Only trade whitelisted tokens</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
