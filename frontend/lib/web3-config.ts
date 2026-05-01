"use client";
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// 0G Galileo Testnet configuration
const zgTestnet = {
  id: 16602,
  name: '0G Galileo Testnet',
  network: 'zg-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OG',
    symbol: 'OG',
  },
  rpcUrls: {
    public: { http: ['https://evmrpc-testnet.0g.ai'] },
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: {
      name: 'ZG Chainscan',
      url: 'https://chainscan-galileo.0g.ai',
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'iKAIZEN',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [sepolia, zgTestnet as any],
  ssr: true,
});

export { zgTestnet };
