import { Text, type As } from '@chakra-ui/react';

import { useTokenMeta } from '../store/useToken';

export function TokenSymbol({ as = 'span' }: { as?: As }) {
  const { data: meta } = useTokenMeta();

  return (
    <Text as={as}>
      <abbr title={meta.name}>{meta.symbol}</abbr>
    </Text>
  );
}
