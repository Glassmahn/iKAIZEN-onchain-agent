"use client"

import { useState, useEffect } from "react"
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
import { apiClient, PortfolioHistory } from "@/lib/api-client"

const timeRanges = ["24H", "7D", "30D", "ALL"] as const
type TimeRange = typeof timeRanges[number]

const rangeDays: Record<TimeRange, number> = {
  "24H": 1,
  "7D": 7,
  "30D": 30,
  "ALL": 90,
}

export function PortfolioChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30D")
  const [data, setData] = useState<PortfolioHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiClient.getPortfolioHistory(rangeDays[selectedRange]).then(data => {
      setData(data)
      setLoading(false)
    })
  }, [selectedRange])

  const currentValue = data.length > 0 ? data[data.length - 1]?.value : 0
  const startValue = data.length > 0 ? data[0]?.value : 0
  const isPositive = currentValue >= startValue

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
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${currentValue >= 0 ? '+' : ''}${currentValue.toFixed(4)} ETH`}
          </p>
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
        {loading ? (
          <div className="w-full h-full bg-muted/30 rounded-lg animate-pulse" />
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No data yet. Trigger a cycle to start tracking.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "oklch(0.8 0.22 145)" : "oklch(0.65 0.25 25)"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "oklch(0.8 0.22 145)" : "oklch(0.65 0.25 25)"} stopOpacity={0} />
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
                tickFormatter={(value) => `${value.toFixed(3)} ETH`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg px-4 py-2 shadow-lg">
                        <p className="text-sm text-muted-foreground">{payload[0].payload.date}</p>
                        <p className="text-lg font-bold text-primary">{(payload[0].value as number).toFixed(4)} ETH</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "oklch(0.8 0.22 145)" : "oklch(0.65 0.25 25)"}
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
