"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Mint Your iKAIZEN",
    description: "Create your ERC-7857 iNFT on 0G Testnet. Your agent's encrypted soul is stored securely with its initial trading goals and risk tolerance.",
    details: ["Connect wallet", "Set trading parameters", "Mint iNFT"],
  },
  {
    number: "02",
    title: "Fund & Activate",
    description: "Send testnet tokens to your iKAIZEN. KeeperHub automation triggers the agent cycle every few hours, keeping it alive and trading.",
    details: ["Transfer tokens", "Enable automation", "Set trigger intervals"],
  },
  {
    number: "03",
    title: "Think & Trade",
    description: "0G Compute runs AI inference in TEE to analyze markets and decide on trades. Uniswap API executes the swaps autonomously.",
    details: ["AI market analysis", "Strategy execution", "Uniswap swaps"],
  },
  {
    number: "04",
    title: "Reflect & Evolve",
    description: "After each trade, iKAIZEN reflects on outcomes, updates its memory, and improves its strategy. The new soul is encrypted and stored on-chain.",
    details: ["Outcome analysis", "Strategy refinement", "Soul update"],
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-foreground">The Autonomous </span>
            <span className="text-accent">Agent Loop</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From minting to continuous self-improvement, watch how iKAIZEN 
            operates as a fully autonomous trading entity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 hidden lg:block" />
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`${i % 2 === 1 ? "lg:col-start-2" : ""} mb-8 lg:mb-0`}>
                  <div className="p-8 rounded-2xl glass border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                      <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    className="w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center"
                  >
                    <ArrowRight className={`h-5 w-5 text-primary ${i % 2 === 1 ? "rotate-180" : ""}`} />
                  </motion.div>
                </div>

                {/* Empty column for alternating layout */}
                <div className={`hidden lg:block ${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loop indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-accent/30">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">
              Loop repeats autonomously via KeeperHub automation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
