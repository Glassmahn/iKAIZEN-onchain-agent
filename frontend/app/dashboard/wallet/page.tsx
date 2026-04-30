"use client"

import { motion } from "framer-motion"
import { Wallet, Send, ArrowDownToLine, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const tokens = [
  { symbol: "ETH", name: "Ethereum", balance: "1.45", value: "$2,892.50", change: "+3.2%" },
  { symbol: "USDC", name: "USD Coin", balance: "1,234.56", value: "$1,234.56", change: "0.0%" },
  { symbol: "OG", name: "0G Token", balance: "500.00", value: "$250.00", change: "+5.8%" },
]

const recentTransactions = [
  { type: "receive", token: "ETH", amount: "+0.5", from: "Uniswap", date: "2h ago" },
  { type: "send", token: "USDC", amount: "-500", to: "Uniswap", date: "6h ago" },
  { type: "receive", token: "USDC", amount: "+1,234.56", from: "Uniswap", date: "6h ago" },
  { type: "send", token: "ETH", amount: "-0.3", to: "Uniswap", date: "18h ago" },
]

export default function WalletPage() {
  const [copied, setCopied] = useState(false)
  const walletAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Wallet</h1>
        <p className="text-muted-foreground">Manage your iKAIZEN&apos;s funds</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main wallet card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                    <p className="text-4xl font-bold text-foreground">$4,377.06</p>
                    <p className="text-sm text-accent mt-1">+$142.30 (3.4%) today</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Wallet address */}
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
                      <p className="font-mono text-sm text-foreground">{walletAddress.slice(0, 20)}...{walletAddress.slice(-8)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={copyAddress}>
                        {copied ? (
                          <Check className="h-4 w-4 text-accent" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Token balances */}
          <Card>
            <CardHeader>
              <CardTitle>Token Balances</CardTitle>
              <CardDescription>Assets held by your agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokens.map((token, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{token.name}</p>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{token.balance} {token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick deposit */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Deposit</CardTitle>
              <CardDescription>Fund your agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (ETH)</Label>
                <Input type="number" placeholder="0.0" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Deposit ETH
              </Button>
            </CardContent>
          </Card>

          {/* Recent transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${tx.type === "receive" ? "bg-accent/10" : "bg-destructive/10"}`}>
                        {tx.type === "receive" ? (
                          <ArrowDownToLine className="h-3 w-3 text-accent" />
                        ) : (
                          <Send className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {tx.type === "receive" ? `From ${tx.from}` : `To ${tx.to}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-mono ${tx.type === "receive" ? "text-accent" : "text-destructive"}`}>
                      {tx.amount} {tx.token}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
