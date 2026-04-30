"use client"

import { motion } from "framer-motion"
import { Brain, Shield, Zap, RefreshCw, Wallet, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Soul",
    description: "Each iKAIZEN has an encrypted soul containing its goals, memories, and evolving trading strategy stored securely on 0G Storage.",
    gradient: "from-primary to-primary/50",
  },
  {
    icon: Shield,
    title: "TEE-Secured Inference",
    description: "All AI thinking happens inside Trusted Execution Environments via 0G Compute, ensuring your strategy remains private and tamper-proof.",
    gradient: "from-accent to-accent/50",
  },
  {
    icon: Zap,
    title: "Autonomous Trading",
    description: "Executes real swaps on Uniswap autonomously. No manual intervention needed - just fund it and watch it work.",
    gradient: "from-primary to-accent",
  },
  {
    icon: RefreshCw,
    title: "Self-Improvement Loop",
    description: "After each trade, iKAIZEN reflects, learns from outcomes, and updates its strategy. Continuous kaizen - continuous improvement.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Wallet,
    title: "True Ownership",
    description: "Your iKAIZEN is an ERC-7857 iNFT that you fully own. Its soul, its gains, its evolution - all yours on the blockchain.",
    gradient: "from-primary/80 to-primary",
  },
  {
    icon: BarChart3,
    title: "Live Monitoring",
    description: "Track every decision, every trade, every reflection in real-time through our comprehensive dashboard.",
    gradient: "from-accent/80 to-accent",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
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
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Intelligence That </span>
            <span className="text-primary">Lives On-Chain</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            iKAIZEN combines cutting-edge AI with blockchain technology to create 
            truly autonomous trading agents that think, trade, and evolve.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl glass border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                <feature.icon className="h-6 w-6 text-background" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
