import { useState } from 'react';
import { HStack, Text, Link, Spinner } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { bank } from '@app/contract';
import { stringShorten } from '@app/utils';
import { useWallet } from '../../store/useWallet';
import { DepositForm as Form } from './deposit-form';
import { TransactionReceipt } from 'viem';
import { useBankBalance } from '../../store/useBankBalance';
import { useTokenQuery } from '../../store/useToken';

type TransactionStatus =
  | {
      status: 'pending';
    }
  | {
      status: 'writing';
    }
  | {
      status: 'executed';
      hash: `0x${string}`;
    }
  | {
      status: 'receipt';
      hash: `0x${string}`;
      receipt: TransactionReceipt;
    };

export function Deposit() {
  const { data, status } = useWallet();
  const { refetch: refetchBankBalance } = useBankBalance();
  const { data: tokenData, refetch: refetchTokenData } = useTokenQuery();

  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    status: 'pending',
  });

  if (status !== 'success' || !data) {
    throw new Error('Expected Wallet to be connected.');
  }

  const { publicClient, walletClient, address } = data;

  const onDeposit = async (amount: number) => {
    setTxStatus({ status: 'writing' });
    const { request } = await publicClient.simulateContract({
      ...bank,
      account: address,
      functionName: 'deposit',
      args: [BigInt(10)],
    });
    const hash = await walletClient.writeContract(request);

    setTxStatus({ status: 'executed', hash });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    setTxStatus({ status: 'receipt', hash, receipt });

    // manually invalidate cache
    refetchBankBalance();
    refetchTokenData();
  };

  return (
    <div>
      <Form
        onDeposit={onDeposit}
        tokenData={tokenData}
        isLoading={
          txStatus.status === 'writing' || txStatus.status === 'executed'
        }
      />

      {/* Transaction status */}
      {txStatus.status === 'writing' && (
        <HStack className="mt-4" spacing={2} color="grey" fontSize="xs">
          <Spinner size="sm" />
          <Text>Waiting for wallet confirmation</Text>
        </HStack>
      )}
      {txStatus.status === 'executed' && (
        <HStack className="mt-4" spacing={2} color="grey" fontSize="xs">
          <Spinner size="sm" />
          <Text>
            <span>Waiting for Block confirmation. </span>
            <Link
              href={`https://sepolia.etherscan.io/tx/${txStatus.hash}`}
              isExternal
            >
              Explore <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        </HStack>
      )}
      {txStatus.status === 'receipt' && (
        <div>
          <Text mt={4} color="grey" fontSize="xs">
            <span>Executed with hash .</span>
            <Link
              href={`https://sepolia.etherscan.io/tx/${txStatus.hash}`}
              isExternal
            >
              {stringShorten(txStatus.hash)} <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
          <Text color="grey" fontSize="xs">
            <span>Block: </span>
            <Link
              href={`https://sepolia.etherscan.io/block/${txStatus.receipt.blockHash.toString()}`}
              isExternal
            >
              {stringShorten(txStatus.receipt.blockHash.toString())}{' '}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        </div>
      )}
    </div>
  );
}
