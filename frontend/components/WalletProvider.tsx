'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

// 0G Galileo Testnet
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
} as const;

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'iKAIZEN-demo-project-id';

const config = getDefaultConfig({
  appName: 'iKAIZEN',
  projectId,
  chains: [sepolia, zgTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
