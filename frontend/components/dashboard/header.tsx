"use client"

import { Bell, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

export function DashboardHeader() {
  const { address } = useAccount()

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions, addresses..."
          className="pl-10 bg-muted/50 border-border focus:bg-background"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Network indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-accent">0G Testnet</span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Trade Executed</span>
              <span className="text-xs text-muted-foreground">Swapped 0.5 ETH → 1,234 USDC</span>
              <span className="text-xs text-primary">2 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Agent Reflection Complete</span>
              <span className="text-xs text-muted-foreground">Strategy updated to v1.3</span>
              <span className="text-xs text-primary">1 hour ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Cycle Triggered</span>
              <span className="text-xs text-muted-foreground">KeeperHub automation ran successfully</span>
              <span className="text-xs text-primary">3 hours ago</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Wallet connection button */}
        <ConnectButton />
      </div>
    </header>
  )
}

export function DashboardHeaderWithWallet() {
  const { address } = useAccount()

  const handleOpenExplorer = () => {
    if (address) {
      window.open(`https://testnet.0gscan.xyz/address/${address}`, '_blank')
    }
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  return (
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-6">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions, addresses..."
              className="pl-10 bg-muted/50 border-border focus:bg-background"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Network indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent">0G Testnet</span>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="text-sm font-medium">Trade Executed</span>
                  <span className="text-xs text-muted-foreground">Swapped 0.5 ETH → 1,234 USDC</span>
                  <span className="text-xs text-primary">2 minutes ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="text-sm font-medium">Agent Reflection Complete</span>
                  <span className="text-xs text-muted-foreground">Strategy updated to v1.3</span>
                  <span className="text-xs text-primary">1 hour ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="text-sm font-medium">Cycle Triggered</span>
                  <span className="text-xs text-muted-foreground">KeeperHub automation ran successfully</span>
                  <span className="text-xs text-primary">3 hours ago</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Connected Account</DropdownMenuLabel>
            
              <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenExplorer}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyAddress}>
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConnectButton />
          </div>
        </header>
    );
}