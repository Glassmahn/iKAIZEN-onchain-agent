"use client"

import Link from "next/link"
import { Zap, Github, Twitter, ExternalLink } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Technology", href: "#technology" },
    { label: "Roadmap", href: "#roadmap" },
  ],
  resources: [
    { label: "Documentation", href: process.env.NEXT_PUBLIC_DOCS_URL || "https://medium.com/@glassman4664/ikaizen-onchain-agent-537cbc3862d5", external: true },
    { label: "GitHub", href: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/glassmahn/iKAIZEN-onchain-agent", external: true },
    { label: "Twitter", href: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/ifu_naya2", external: true },
  ],
  integrations: [
    { label: "0G Network", href: "https://0g.ai", external: true },
    { label: "Uniswap", href: "https://uniswap.org", external: true },
    { label: "KeeperHub", href: "https://keeperhub.com", external: true },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-primary">i</span>
                <span className="text-foreground">KAIZEN</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The first self-improving AI trading agent that lives as an iNFT on the blockchain.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/glassmahn/iKAIZEN-onchain-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/ifu_naya2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Powered By</h4>
            <ul className="space-y-3">
              {footerLinks.integrations.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built for ETHGlobal Open Agents Hackathon
          </p>
          <p className="text-sm text-muted-foreground">
            May 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
