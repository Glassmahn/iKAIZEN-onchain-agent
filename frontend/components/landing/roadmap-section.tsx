"use client"

import { motion } from "framer-motion"
import { Check, Clock, Sparkles } from "lucide-react"

const phases = [
  {
    phase: "Phase 0",
    title: "Pre-Kickoff",
    status: "completed",
    date: "Apr 23",
    items: [
      "ETHGlobal Open Agents registration",
      "Wallet & testnet setup",
      "Development environment ready",
      "GitHub repository initialized",
    ],
  },
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "completed",
    date: "Apr 24-25",
    items: [
      "ERC-7857 contract deployment",
      "First iNFT minted on testnet",
      "Soul encryption & storage",
      "Basic retrieval + decryption",
    ],
  },
  {
    phase: "Phase 2",
    title: "Core Agent Brain",
    status: "in-progress",
    date: "Apr 26-28",
    items: [
      "0G Compute inference integration",
      "Think → Trade → Reflect loop",
      "Self-improving strategy system",
      "Memory & soul updates",
    ],
  },
  {
    phase: "Phase 3",
    title: "Integration & Polish",
    status: "upcoming",
    date: "Apr 29 - May 1",
    items: [
      "KeeperHub automation setup",
      "Uniswap trading integration",
      "x402 autonomous payments",
      "Dashboard completion",
    ],
  },
  {
    phase: "Phase 4",
    title: "Demo & Submission",
    status: "upcoming",
    date: "May 2-3",
    items: [
      "Demo video recording",
      "Documentation finalization",
      "Live Vercel deployment",
      "ETHGlobal submission",
    ],
  },
]

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center">
        <Check className="h-4 w-4 text-accent" />
      </div>
    )
  }
  if (status === "in-progress") {
    return (
      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center animate-pulse">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
      <Clock className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

export function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
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
            Development Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Building in </span>
            <span className="text-accent">Public</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            11 days to create a prize-winning autonomous iNFT trading agent.
            Follow our journey from concept to submission.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-primary to-muted" />
          
          <div className="space-y-12">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                  <StatusIcon status={phase.status} />
                </div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className={`p-6 rounded-2xl glass border ${
                    phase.status === "in-progress" 
                      ? "border-primary/50 glow-border" 
                      : phase.status === "completed"
                      ? "border-accent/30"
                      : "border-border"
                  }`}>
                    <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        phase.status === "completed" ? "bg-accent/20 text-accent" :
                        phase.status === "in-progress" ? "bg-primary/20 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {phase.date}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        {phase.phase}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-4">{phase.title}</h3>
                    
                    <ul className={`space-y-2 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                      {phase.items.map((item, j) => (
                        <li key={j} className={`flex items-center gap-2 text-sm text-muted-foreground ${
                          i % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            phase.status === "completed" ? "bg-accent" :
                            phase.status === "in-progress" ? "bg-primary" :
                            "bg-muted-foreground"
                          }`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
