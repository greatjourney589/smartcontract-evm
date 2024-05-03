import { useQuery } from '@tanstack/react-query';

import { token, bank } from '@app/contract';
import { useWallet } from './useWallet';

export function useTokenUserData() {
  const { data: wallet, status } = useWallet();

  return useQuery({
    queryKey: ['token-read'],
    queryFn: async () => {
      // Enabled is false if the wallet is not connected
      if (!wallet) {
        throw new Error('Expected Wallet to be connected.');
      }

      const results = await wallet.publicClient.multicall({
        contracts: [
          {
            ...token,
            functionName: 'allowance',
            args: [wallet.address, bank.address],
          },
          {
            ...token,
            functionName: 'balanceOf',
            args: [wallet.address],
          },
        ],
      });

      // @TODO: Handle better
      if (results.some((r) => r.status === 'failure')) {
        console.log('Failed to read token contract', results);
        throw new Error('Failed to read token contract');
      }

      return {
        allowance: results[0].result as bigint,
        balanceOf: results[1].result as bigint,
      };
    },
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: status === 'success' && wallet != null,
  });
}

export function useTokenMeta() {
  const { data: wallet, status } = useWallet();

  return useQuery({
    queryKey: ['token-metadata'],
    queryFn: async () => {
      // Enabled is false if the wallet is not connected
      if (!wallet) {
        throw new Error('Expected Wallet to be connected.');
      }

      const results = await wallet.publicClient.multicall({
        contracts: [
          {
            ...token,
            functionName: 'name',
          },
          {
            ...token,
            functionName: 'symbol',
          },
          {
            ...token,
            functionName: 'decimals',
          },
        ],
      });

      // @TODO: Handle better
      if (results.some((r) => r.status === 'failure')) {
        console.log('Failed to read token contract', results);
        throw new Error('Failed to read token contract');
      }

      return {
        name: results[0].result as string,
        symbol: results[1].result as string,
        decimals: results[2].result as number,
      };
    },
    // This data is not expected to change frequently so we can cache it for a long time
    // We use initialData to populate the cache and combine staleTime with initialDataUpdatedAt to
    // refetch data after mounting, and then every 5 minutes
    staleTime: 1000 * 60 * 5,
    initialData: {
      name: 'BankToken',
      symbol: 'TTK',
      decimals: 1200,
    },
    initialDataUpdatedAt: Date.now() - 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: status === 'success' && wallet != null,
  });
}
