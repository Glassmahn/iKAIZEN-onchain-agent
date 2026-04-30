"use client"

import { StatsCards } from "@/components/dashboard/stats-cards"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { AgentSoul } from "@/components/dashboard/agent-soul"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your iKAIZEN autonomous agent</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Chart & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <PortfolioChart />
          <ActivityFeed />
        </div>

        {/* Right column - Soul & Actions */}
        <div className="space-y-6">
          <AgentSoul />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
