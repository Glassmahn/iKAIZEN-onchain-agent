import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
})

export const metadata: Metadata = {
  title: 'iKAIZEN - Autonomous iNFT Trading Agent',
  description: 'The first self-improving AI trading agent that lives as an iNFT on the blockchain. Powered by 0G Network, Uniswap, and KeeperHub.',
  keywords: ['iNFT', 'AI', 'Trading', 'DeFi', 'Blockchain', '0G Network', 'Autonomous Agent', 'Web3'],
  authors: [{ name: 'iKAIZEN' }],
  openGraph: {
    title: 'iKAIZEN - Autonomous iNFT Trading Agent',
    description: 'The first self-improving AI trading agent that lives as an iNFT on the blockchain.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iKAIZEN - Autonomous iNFT Trading Agent',
    description: 'The first self-improving AI trading agent that lives as an iNFT on the blockchain.',
  },
}

export const viewport: Viewport = {
  themeColor: '#00d4ff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
