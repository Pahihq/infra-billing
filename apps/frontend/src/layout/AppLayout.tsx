import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconCoin,
  IconLayoutDashboard,
  IconLogout,
  IconReceipt2,
  IconServer2,
  IconSettings,
  IconStack2,
  type Icon,
} from '@tabler/icons-react';
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { useLogout, useMe } from '@/api/auth';
import { BuildInfo } from '@/components/BuildInfo';

interface NavItem {
  to: string;
  label: string;
  icon: Icon;
  end?: boolean;
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Обзор',
    items: [{ to: '/', label: 'Дашборд', icon: IconLayoutDashboard, end: true }],
  },
  {
    section: 'Инфраструктура',
    items: [
      { to: '/providers', label: 'Провайдеры', icon: IconServer2 },
      { to: '/services', label: 'Сервисы', icon: IconStack2 },
      { to: '/payments', label: 'Платежи', icon: IconReceipt2 },
    ],
  },
  {
    section: 'Настройки',
    items: [{ to: '/settings', label: 'Настройки', icon: IconSettings }],
  },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const me = useMe();
  const logout = useLogout();

  return (
    <AppShell header={{ height: 56 }} navbar={{ width: 260, breakpoint: 'sm' }} padding="lg">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <ThemeIcon variant="light" color="brand" radius="md">
              <IconCoin size={18} />
            </ThemeIcon>
            <Text fw={700}>Infra Billing</Text>
          </Group>
          <BuildInfo />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="lg">
            {NAV.map((group) => (
              <div key={group.section}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" px="sm" mb={6}>
                  {group.section}
                </Text>
                {group.items.map((it) => {
                  const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
                  const ItemIcon = it.icon;
                  return (
                    <NavLink
                      key={it.to}
                      component={RouterNavLink}
                      to={it.to}
                      end={it.end}
                      active={active}
                      label={it.label}
                      leftSection={<ItemIcon size={18} stroke={1.5} />}
                    />
                  );
                })}
              </div>
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Group gap="sm" p="sm" justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <Avatar color="brand" radius="xl">
                {(me.data?.username ?? 'A').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Text size="sm" fw={600}>
                  {me.data?.username ?? '—'}
                </Text>
                <Text size="xs" c="dimmed">
                  single-user
                </Text>
              </Box>
            </Group>
            <Tooltip label="Выйти">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => logout.mutate()}
                loading={logout.isPending}
              >
                <IconLogout size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
