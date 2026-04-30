"use client"

import { motion } from "framer-motion"
import { ArrowDownUp, TrendingUp, TrendingDown, ExternalLink, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const trades = [
  { id: 1, from: "ETH", to: "USDC", fromAmount: "0.5", toAmount: "1,234.56", date: "Apr 28, 14:32", pnl: "+2.3%", status: "success", txHash: "0x1a2b...3c4d" },
  { id: 2, from: "USDC", to: "ETH", fromAmount: "500", toAmount: "0.25", date: "Apr 28, 08:15", pnl: "-0.5%", status: "success", txHash: "0x5e6f...7g8h" },
  { id: 3, from: "ETH", to: "USDC", fromAmount: "0.3", toAmount: "756.00", date: "Apr 27, 22:48", pnl: "+4.1%", status: "success", txHash: "0x9i0j...1k2l" },
  { id: 4, from: "USDC", to: "ETH", fromAmount: "800", toAmount: "0.38", date: "Apr 27, 16:20", pnl: "+1.8%", status: "success", txHash: "0xmn3o...4p5q" },
  { id: 5, from: "ETH", to: "USDC", fromAmount: "0.2", toAmount: "498.20", date: "Apr 27, 10:05", pnl: "-1.2%", status: "success", txHash: "0xrs6t...7u8v" },
  { id: 6, from: "USDC", to: "ETH", fromAmount: "1,000", toAmount: "0.48", date: "Apr 26, 20:30", pnl: "+3.5%", status: "success", txHash: "0xwx9y...0z1a" },
  { id: 7, from: "ETH", to: "USDC", fromAmount: "0.4", toAmount: "985.60", date: "Apr 26, 14:15", pnl: "+0.8%", status: "success", txHash: "0xbc2d...3e4f" },
  { id: 8, from: "USDC", to: "ETH", fromAmount: "600", toAmount: "0.29", date: "Apr 26, 08:45", pnl: "+2.1%", status: "success", txHash: "0xgh5i...6j7k" },
]

const stats = [
  { label: "Total Trades", value: "47", icon: ArrowDownUp },
  { label: "Win Rate", value: "68%", icon: TrendingUp, color: "text-accent" },
  { label: "Total Volume", value: "12.5 ETH", icon: ArrowDownUp },
  { label: "Net PnL", value: "+12.5%", icon: TrendingUp, color: "text-accent" },
]

export default function TradesPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trade History</h1>
        <p className="text-muted-foreground">All executed trades by your iKAIZEN agent</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-xl font-bold", stat.color || "text-foreground")}>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trades table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Autonomous swaps executed via Uniswap</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Swap</TableHead>
                <TableHead className="text-right">From Amount</TableHead>
                <TableHead className="text-right">To Amount</TableHead>
                <TableHead className="text-right">PnL</TableHead>
                <TableHead className="text-right">Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade, i) => (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group"
                >
                  <TableCell className="text-muted-foreground">{trade.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{trade.from}</Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="font-mono">{trade.to}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{trade.fromAmount} {trade.from}</TableCell>
                  <TableCell className="text-right font-mono">{trade.toAmount} {trade.to}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 font-medium",
                      trade.pnl.startsWith("+") ? "text-accent" : "text-destructive"
                    )}>
                      {trade.pnl.startsWith("+") ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {trade.pnl}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-mono"
                    >
                      {trade.txHash}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
