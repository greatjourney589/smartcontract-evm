'use client';

import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  HStack,
  Center,
  Spinner,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { TokenSymbol } from '../token-symbol';

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

  if (!tokenData) {
    return (
      <Center h="150px">
        <Spinner color="grey" />
      </Center>
    );
  }

  const allowance = tokenData.allowance.toString();

  const isFormDisabled = isLoading || allowance === '0';

  return (
    <form onSubmit={onSubmit}>
      {allowance === '0' && (
        <Alert status="warning" my={4}>
          <AlertIcon />
          It seems your account has no allowance.
          <Link
            href="https://sepolia.etherscan.io/address/0x9aF18838611950953823154a04a14d2A34eE615e#writeContract#F1"
            isExternal
            color="teal.500"
          >
            <ExternalLinkIcon mx="2px" />
            Increase your allowance
          </Link>
        </Alert>
      )}
      <FormControl isDisabled={isFormDisabled}>
        <FormLabel>Amount</FormLabel>
        <NumberInput max={parseInt(allowance, 10)} min={1} name="amount">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <HStack spacing={4} fontSize="sm">
        <Text>
          Allowance: {allowance} <TokenSymbol />
        </Text>
        <Link
          href="https://sepolia.etherscan.io/address/0x9aF18838611950953823154a04a14d2A34eE615e#writeContract#F1"
          isExternal
          color="teal.500"
        >
          <ExternalLinkIcon mx="2px" />
          Increase Allowance
        </Link>
      </HStack>

      <Button
        isDisabled={isFormDisabled}
        mt={4}
        colorScheme="teal"
        type="submit"
      >
        Deposit
      </Button>
    </form>
  );
}
