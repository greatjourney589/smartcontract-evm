import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { toHex } from 'viem';
import { useEffect, useState } from 'react';

import { network, useWallet } from '../store/useWallet';

const targetChainId = toHex(network.id);

export function NetworkGuard() {
  const { status } = useWallet();
  const [requiresSwitch, setRequiresSwitch] = useState(false);

  const isWalletConnected = status === 'success';

  // Force network check on load
  useEffect(() => {
    if (!window.ethereum || !isWalletConnected) {
      return;
    }

    const networkChange = async () => {
      try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });

        setRequiresSwitch(false);
      } catch (error: any) {
        // Try adding error if the network is not added
        if (error?.code === 4902) {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetChainId,
                rpcUrl: network.rpcUrls.default.http[0],
              },
            ],
          });

          setRequiresSwitch(false);
        }

        setRequiresSwitch(true);
      }
    };

    networkChange();
  }, [setRequiresSwitch, isWalletConnected]);

  // Watch on wallet chain change
  useEffect(() => {
    if (!window.ethereum || !isWalletConnected) {
      return;
    }

    const updateNotice = (chainId: string) => {
      if (chainId !== targetChainId) {
        setRequiresSwitch(true);
      } else {
        setRequiresSwitch(false);
      }
    };

    // Network check on wallet network change
    window.ethereum.on('chainChanged', updateNotice);

    return () => {
      window.ethereum?.removeListener('chainChanged', updateNotice);
    };
  }, [setRequiresSwitch, isWalletConnected]);

  if (requiresSwitch) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <div>
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription>
            This application works on the Sepolia Network. Please use MetaMask
            to switch your network to Sepolia.
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return null;
}
