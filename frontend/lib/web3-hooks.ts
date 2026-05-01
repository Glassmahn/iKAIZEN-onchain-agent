import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useState } from 'react';

// Contract addresses from environment with fallbacks
const AGENT_NFT_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_NFT_ADDRESS || '0x1515d22b7Ea637D69c760C3986373FB976d96E8F') as `0x${string}`;
const AGENT_MARKET_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_MARKET_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

// AgentNFT ABI (excerpt - key functions)
export const AGENT_NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' },
      { name: 'creator', type: 'address' },
    ],
    name: 'mintWithRole',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// AgentMarket ABI (excerpt)
export const AGENT_MARKET_ABI = [
  {
    inputs: [],
    name: 'getFeeRate',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Hook to mint an iNFT
export function useMintAgent() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = async (to: string, uri: string, creator: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!AGENT_NFT_ADDRESS || AGENT_NFT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('AgentNFT contract address not configured. Set NEXT_PUBLIC_AGENT_NFT_ADDRESS environment variable.');
      }
      const hash = await writeContractAsync({
        address: AGENT_NFT_ADDRESS,
        abi: AGENT_NFT_ABI,
        functionName: 'mintWithRole',
        args: [to as `0x${string}`, uri, creator as `0x${string}`],
      });
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mint, isLoading, error };
}

// Hook to read user's agent NFT balance
export function useAgentBalance() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: AGENT_NFT_ADDRESS,
    abi: AGENT_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return balance;
}

// Hook to read market fee rate
export function useMarketFeeRate() {
  const { data: feeRate } = useReadContract({
    address: AGENT_MARKET_ADDRESS,
    abi: AGENT_MARKET_ABI,
    functionName: 'getFeeRate',
  });

  return feeRate;
}
