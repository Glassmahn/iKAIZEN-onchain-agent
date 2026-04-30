"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const timeRanges = ["24H", "7D", "30D", "ALL"]

// Sample data
const data = [
  { date: "Apr 1", value: 1.8, eth: 1.8 },
  { date: "Apr 5", value: 1.95, eth: 1.95 },
  { date: "Apr 10", value: 2.1, eth: 2.1 },
  { date: "Apr 15", value: 1.9, eth: 1.9 },
  { date: "Apr 18", value: 2.3, eth: 2.3 },
  { date: "Apr 22", value: 2.2, eth: 2.2 },
  { date: "Apr 25", value: 2.35, eth: 2.35 },
  { date: "Apr 28", value: 2.45, eth: 2.45 },
]

export function PortfolioChart() {
  const [selectedRange, setSelectedRange] = useState("30D")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio Performance</h3>
          <p className="text-sm text-muted-foreground">Track your iKAIZEN value over time</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 text-xs",
                selectedRange === range && "bg-background text-foreground shadow-sm"
              )}
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.18 195)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.75 0.18 195)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              tickFormatter={(value) => `${value} ETH`}
              domain={["dataMin - 0.2", "dataMax + 0.2"]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-lg px-4 py-2 shadow-lg">
                      <p className="text-sm text-muted-foreground">{payload[0].payload.date}</p>
                      <p className="text-lg font-bold text-primary">{payload[0].value} ETH</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="oklch(0.75 0.18 195)"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
