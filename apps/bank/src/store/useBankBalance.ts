import { useQuery } from '@tanstack/react-query';

import { bank } from '@app/contract';
import { useWallet } from './useWallet';

export function useBankBalance() {
  const { data: wallet, status } = useWallet();

  return useQuery({
    queryKey: ['bank-balance'],
    queryFn: async () => {
      // Enabled is false if the wallet is not connected
      if (!wallet) {
        throw new Error('Expected Wallet to be connected.');
      }

      return wallet.publicClient.readContract({
        ...bank,
        functionName: 'getBalance',
        args: [wallet.address],
      });
    },
    initialData: BigInt(0),
    staleTime: 200,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: status === 'success' && wallet != null,
  });
}
