"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Zap,
  LayoutDashboard,
  Brain,
  History,
  Settings,
  Wallet,
  Activity,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: PlusCircle, label: "Mint iKAIZEN", href: "/dashboard/mint" },
  { icon: Brain, label: "Agent Soul", href: "/dashboard/soul" },
  { icon: Activity, label: "Activity Log", href: "/dashboard/activity" },
  { icon: History, label: "Trade History", href: "/dashboard/trades" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/10 border border-sidebar-primary/30">
            <Zap className="h-5 w-5 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold">
              <span className="text-sidebar-primary">i</span>
              <span className="text-sidebar-foreground">KAIZEN</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/30"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Agent Status */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-sidebar-foreground">Agent Active</span>
          </div>
          <p className="text-xs text-sidebar-foreground/60">
            Next cycle in 2h 34m
          </p>
        </div>
      )}

      {/* Collapse button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 w-8 h-8 rounded-full border border-border bg-background hover:bg-accent"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </aside>
  )
}
