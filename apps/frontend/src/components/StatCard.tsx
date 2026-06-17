import { Card, Group, Text, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: Icon;
  color?: string;
}

export function StatCard({ label, value, icon: IconCmp, color = 'brand' }: StatCardProps) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {label}
          </Text>
          <Text size="xl" fw={700} mt={4}>
            {value}
          </Text>
        </div>
        <ThemeIcon variant="light" color={color} radius="md" size="lg">
          <IconCmp size={20} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}
