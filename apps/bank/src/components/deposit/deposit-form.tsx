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
  useToast,
} from '@chakra-ui/react';

type Props = {
  onDeposit?: (amount: number) => Promise<void>;
  isLoading?: boolean;
};

export function DepositForm({ onDeposit, isLoading = false }: Props) {
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
        <NumberInput max={1000} min={1} name="amount">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Button isDisabled={isLoading} mt={4} colorScheme="teal" type="submit">
        Deposit
      </Button>
    </form>
  );
}
