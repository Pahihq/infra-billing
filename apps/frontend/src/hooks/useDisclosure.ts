import { useCallback, useState } from 'react';

/** Drop-in replacement for useDisclosure from @mantine/hooks with the same call contract. */
export function useDisclosure(
  initial = false,
): [boolean, { open: () => void; close: () => void; toggle: () => void }] {
  const [opened, setOpened] = useState(initial);
  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened((v) => !v), []);
  return [opened, { open, close, toggle }];
}
