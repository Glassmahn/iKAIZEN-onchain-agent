"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const technologies = [
  {
    name: "0G Network",
    role: "Infrastructure Layer",
    description: "ERC-7857 iNFT standard, encrypted storage, and TEE-secured compute inference for private AI reasoning.",
    color: "primary",
    links: ["0G Testnet", "ERC-7857 Docs"],
  },
  {
    name: "Uniswap",
    role: "Trading Execution",
    description: "Industry-leading DEX integration for executing autonomous token swaps with deep liquidity.",
    color: "accent",
    links: ["Trading API", "Developer Portal"],
  },
  {
    name: "KeeperHub",
    role: "Automation & Payments",
    description: "Decentralized automation triggers the agent cycle. x402 enables the agent to pay for its own execution.",
    color: "primary",
    links: ["MCP Integration", "CLI Docs"],
  },
]

const techStack = [
  { name: "Next.js", category: "Frontend" },
  { name: "wagmi/viem", category: "Web3" },
  { name: "0G SDK", category: "Storage" },
  { name: "Compute SDK", category: "Inference" },
  { name: "Ethers.js", category: "Contracts" },
  { name: "TypeScript", category: "Language" },
]

export function TechnologySection() {
  return (
    <section id="technology" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-secondary/10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
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
            Technology Stack
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Powered By </span>
            <span className="text-primary">The Best</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on cutting-edge Web3 infrastructure for maximum security, 
            decentralization, and performance.
          </p>
        </motion.div>

        {/* Main technologies */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {technologies.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-2xl glass border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="mb-6">
                <span className={`text-xs font-mono uppercase tracking-wider ${
                  tech.color === "primary" ? "text-primary" : "text-accent"
                }`}>
                  {tech.role}
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-2">{tech.name}</h3>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {tech.description}
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-2">
                {tech.links.map((link, j) => (
                  <a
                    key={j}
                    href="#"
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      tech.color === "primary" ? "text-primary hover:text-primary/80" : "text-accent hover:text-accent/80"
                    } transition-colors`}
                  >
                    {link}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>

              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
                tech.color === "primary" ? "bg-primary/5" : "bg-accent/5"
              }`} />
            </motion.div>
          ))}
        </div>

        {/* Tech stack pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {techStack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border"
            >
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              <span className="text-xs text-muted-foreground">/ {item.category}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
