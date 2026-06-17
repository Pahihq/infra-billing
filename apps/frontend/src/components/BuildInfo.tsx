import {
  ActionIcon,
  Badge,
  Button,
  Code,
  CopyButton,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconActivity, IconCheck, IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useBuildInfo } from '@/api/buildInfo';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="md">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      {children}
    </Group>
  );
}

export function BuildInfo() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useBuildInfo();
  const version = data?.version ?? '—';
  // "unknown" is what the build emits when not built from a git checkout.
  const commit = data?.gitCommit && data.gitCommit !== 'unknown' ? data.gitCommit : '';

  return (
    <>
      <Button
        variant="subtle"
        color="gray"
        size="compact-sm"
        leftSection={<IconActivity size={16} />}
        onClick={open}
      >
        v{version}
      </Button>

      <Modal opened={opened} onClose={close} title="О сборке" size="sm" centered>
        <Stack gap="sm">
          <Group>
            <Badge variant="light" color="brand" size="lg">
              v{version}
            </Badge>
          </Group>
          <Row label="Дата сборки">
            <Text size="sm">
              {data?.buildTime ? dayjs(data.buildTime).format('DD.MM.YYYY HH:mm') : '—'}
            </Text>
          </Row>
          <Row label="Коммит">
            {commit ? (
              <CopyButton value={commit}>
                {({ copied, copy }) => (
                  <Group gap={6} wrap="nowrap">
                    <Code>{commit.slice(0, 8)}</Code>
                    <Tooltip label={copied ? 'Скопировано' : 'Копировать'}>
                      <ActionIcon variant="subtle" color="gray" size="sm" onClick={copy}>
                        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                )}
              </CopyButton>
            ) : (
              <Text size="sm">—</Text>
            )}
          </Row>
          <Row label="Node">
            <Text size="sm">{data?.nodeVersion ?? '—'}</Text>
          </Row>
        </Stack>
      </Modal>
    </>
  );
}
