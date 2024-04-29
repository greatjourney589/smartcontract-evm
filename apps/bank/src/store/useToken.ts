import { useQuery } from '@tanstack/react-query';

import { token, bank } from '@app/contract';
import { useWallet } from './useWallet';

export function useTokenQuery() {
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
