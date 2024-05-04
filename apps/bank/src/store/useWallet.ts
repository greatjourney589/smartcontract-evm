import { useQuery } from '@tanstack/react-query';
import { createWalletClient, createPublicClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';

declare global {
  interface Window {
    ethereum?: {
      request(...args: any): Promise<any>;
      on(eventName: 'chainChanged', handler: (chainId: string) => void): void;
      removeListener(
        eventName: 'chainChanged',
        handler: (chainId: string) => void
      ): void;
    };
  }
}

export const network = sepolia;

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      if (!window.ethereum) {
        throw new Error('No Ethereum provider found. MetaMask is required.');
      }

      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      const [address] = await walletClient.requestAddresses();

      return { address, walletClient, publicClient };
    },
    staleTime: Infinity,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    enabled: false,
  });
}
