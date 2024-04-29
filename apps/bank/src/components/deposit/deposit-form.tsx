'use client';

import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  HStack,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

type Props = {
  onDeposit?: (amount: number) => Promise<void>;
  isLoading?: boolean;
  tokenData?:
    | {
        allowance: bigint;
        balanceOf: bigint;
      }
    | null
    | undefined;
};

export function DepositForm({
  onDeposit,
  tokenData,
  isLoading = false,
}: Props) {
  const toast = useToast();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onDeposit) {
      const amount = parseFloat((event.target as any).amount.value);
      const promise = onDeposit(amount);

      toast.promise(promise, {
        success: { title: 'Transaction completed' },
        error: {
          title: 'Transaction rejected',
          description:
            'We are sorry. Something wrong. Please check DevTools Console for further details.',
        },
        loading: { title: 'Processing...', description: 'Please wait' },
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControl isDisabled={isLoading}>
        <FormLabel>Amount</FormLabel>
        <NumberInput
          max={parseInt(tokenData?.allowance.toString() ?? '100000', 10)}
          min={1}
          name="amount"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <HStack spacing={4} fontSize="sm">
        <Text>Allowance: {tokenData?.allowance?.toString()} TTK</Text>
        <Link
          href="https://sepolia.etherscan.io/address/0x9aF18838611950953823154a04a14d2A34eE615e#writeContract#F1"
          isExternal
          color="teal.500"
        >
          <ExternalLinkIcon mx="2px" />
          Increase Allowance
        </Link>
      </HStack>

      <Button isDisabled={isLoading} mt={4} colorScheme="teal" type="submit">
        Deposit
      </Button>
    </form>
  );
}
