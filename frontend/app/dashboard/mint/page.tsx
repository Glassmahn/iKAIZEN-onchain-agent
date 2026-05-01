"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { Zap, Shield, Brain, Sparkles, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMintAgent } from "@/lib/web3-hooks"
import { useToast } from "@/hooks/use-toast"

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const { mint, isLoading, error } = useMintAgent()
  const { toast } = useToast()
  
  const [riskTolerance, setRiskTolerance] = useState([15])
  const [agentName, setAgentName] = useState("")
  const [tradingGoal, setTradingGoal] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [mintError, setMintError] = useState<string | null>(null)

  const handleMint = async () => {
    try {
      setMintError(null)
      setTxHash(null)

      if (!isConnected || !address) {
        setMintError("Please connect your wallet first")
        toast({
          title: "Wallet not connected",
          description: "Connect your wallet to mint an iNFT",
          variant: "destructive",
        })
        return
      }

      if (!agentName.trim()) {
        setMintError("Agent name is required")
        return
      }

      if (!tradingGoal.trim()) {
        setMintError("Trading goal is required")
        return
      }

      // Create metadata URI (you'd normally upload to IPFS/Arweave)
      const metadata = {
        name: agentName,
        description: tradingGoal,
        riskTolerance: riskTolerance[0],
        tradingPair: "ETH-USDC",
      }
      const uri = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`

      // Call mint function
      const hash = await mint(
        address,           // to (recipient)
        uri,              // metadata URI
        address           // creator
      )

      setTxHash(hash as string)
      toast({
        title: "iNFT Minted!",
        description: `Transaction: ${(hash as string).slice(0, 10)}...`,
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to mint NFT"
      setMintError(errorMsg)
      console.error("Mint error:", err)
      toast({
        title: "Mint failed",
        description: errorMsg,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-4"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">ERC-7857 iNFT</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Mint Your iKAIZEN
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Create your autonomous AI trading agent on 0G Network
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Configure Soul
              </CardTitle>
              <CardDescription>
                Define your agent&apos;s personality and trading parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent name */}
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., KAIZEN-001"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>

              {/* Trading goal */}
              <div className="space-y-2">
                <Label htmlFor="goal">Trading Goal</Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Maximize ETH-USDC yield safely with conservative risk management"
                  value={tradingGoal}
                  onChange={(e) => setTradingGoal(e.target.value)}
                  rows={3}
                />
              </div>

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
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Trading pair */}
              <div className="space-y-2">
                <Label>Trading Pair</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-muted text-center">
                    <span className="text-sm font-medium">ETH</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-muted text-center">
                    <span className="text-sm font-medium">USDC</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview & Mint */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Preview card */}
          <Card className="border-primary/30 glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                iKAIZEN Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center mb-6 border border-border">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <Brain className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {agentName || "KAIZEN-???"}
                  </p>
                  <p className="text-sm text-muted-foreground">Autonomous Trading Agent</p>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: Shield, label: "TEE-Secured Inference" },
                  { icon: Brain, label: "Self-Improving AI" },
                  { icon: Zap, label: "Autonomous Trading" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <feature.icon className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Connection status */}
              {!isConnected && (
                <Alert className="border-yellow-500/30 bg-yellow-500/10 mb-4">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                    Connect your wallet to mint an iNFT
                  </AlertDescription>
                </Alert>
              )}

              {/* Error display */}
              {(mintError || error) && (
                <Alert className="border-destructive/30 bg-destructive/10 mb-4">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {mintError || error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success display */}
              {txHash && (
                <Alert className="border-green-500/30 bg-green-500/10 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    <div>iNFT Minted Successfully!</div>
                    <a
                      href={`https://testnet.0gscan.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline mt-1 block"
                    >
                      View on 0G Explorer: {txHash?.slice(0, 10)}...
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleMint}
                disabled={isLoading || !isConnected || !agentName || !tradingGoal || !!txHash}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Minting iNFT...
                  </>
                ) : txHash ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Minted!
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Mint iKAIZEN
                  </>
                )}
              </Button>

              {/* Cost info */}
              <p className="text-xs text-center text-muted-foreground mt-3">
                Estimated gas: ~0.01 OG
              </p>
            </CardContent>
          </Card>

          {/* Info card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-accent shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Secure & Private</h4>
                  <p className="text-sm text-muted-foreground">
                    Your agent&apos;s soul is encrypted and stored on 0G Storage. All inference happens in TEE-secured environments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
