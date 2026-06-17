import { Alert, Badge, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { BarChart, DonutChart } from '@mantine/charts';
import {
  IconAlertTriangle,
  IconCalendarDollar,
  IconCash,
  IconChartBar,
  IconWallet,
} from '@tabler/icons-react';
import { useForecast, useSummary } from '@/api/analytics';
import { StatCard } from '@/components/StatCard';
import { SERVICE_TYPE_LABELS } from '@/constants';
import { formatDateShort, formatMoney } from '@/utils/format';

const COLORS = ['brand.6', 'teal.6', 'blue.6', 'orange.6', 'pink.6', 'grape.6', 'cyan.6', 'lime.6'];

const dayLabel = (n: number) => (n <= 0 ? 'сегодня' : n === 1 ? 'завтра' : `через ${n} дн.`);
const severityColor = (s: 'critical' | 'warning' | 'ok') =>
  s === 'critical' ? 'red' : s === 'warning' ? 'orange' : undefined;

export function DashboardPage() {
  const { data: summary, isLoading } = useSummary();
  const { data: forecast } = useForecast(6);

  const base = summary?.baseCurrency ?? '';
  const donutData = (summary?.byType ?? [])
    .filter((t) => Number(t.monthlyCost) > 0)
    .map((t, i) => ({
      name: SERVICE_TYPE_LABELS[t.type as keyof typeof SERVICE_TYPE_LABELS] ?? t.type,
      value: Number(t.monthlyCost),
      color: COLORS[i % COLORS.length],
    }));
  const forecastData = (forecast ?? []).map((p) => ({
    month: p.month,
    value: Number(p.projected),
  }));
  const upcoming = summary?.upcomingBillings ?? [];
  const critical = upcoming.filter((b) => b.severity === 'critical');

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Дашборд</Title>
        <Text c="dimmed">Обзор расходов на инфраструктуру</Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard
          label="Расходы в месяц"
          value={formatMoney(summary?.monthlyTotal ?? '0', base)}
          icon={IconWallet}
        />
        <StatCard
          label="Прогноз в год"
          value={formatMoney(summary?.yearlyProjection ?? '0', base)}
          icon={IconChartBar}
          color="blue"
        />
        <StatCard
          label="Платежи в этом месяце"
          value={formatMoney(summary?.currentMonthPayments ?? '0', base)}
          icon={IconCash}
          color="teal"
        />
        <StatCard
          label="Всего потрачено"
          value={formatMoney(summary?.totalSpent ?? '0', base)}
          icon={IconCalendarDollar}
          color="grape"
        />
      </SimpleGrid>

      {critical.length > 0 && (
        <Alert
          color="red"
          icon={<IconAlertTriangle size={18} />}
          title="Критично: не хватит на списание"
        >
          <Stack gap={4}>
            {critical.map((b) => (
              <Text key={b.serviceUuid} size="sm">
                <b>
                  {b.providerName} — {b.name}
                </b>
                : списание {dayLabel(b.daysUntil)} на {formatMoney(b.cost, b.currency)}
                {b.providerBalance != null && (
                  <> · баланс {formatMoney(b.providerBalance, b.providerBalanceCurrency)}</>
                )}
              </Text>
            ))}
          </Stack>
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder radius="md" padding="lg">
          <Text fw={600} mb="md">
            Расходы по типам ({base}/мес)
          </Text>
          {donutData.length > 0 ? (
            <Group justify="center">
              <DonutChart data={donutData} withLabelsLine withTooltip size={180} thickness={28} />
            </Group>
          ) : (
            <Text c="dimmed" size="sm">
              {isLoading ? 'Загрузка…' : 'Нет активных сервисов'}
            </Text>
          )}
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Text fw={600} mb="md">
            Прогноз списаний ({base})
          </Text>
          {forecastData.length > 0 ? (
            <BarChart
              h={200}
              data={forecastData}
              dataKey="month"
              series={[{ name: 'value', label: 'Прогноз', color: 'brand.6' }]}
            />
          ) : (
            <Text c="dimmed" size="sm">
              Нет данных
            </Text>
          )}
        </Card>
      </SimpleGrid>

      <Card withBorder radius="md" padding="lg">
        <Text fw={600} mb="md">
          Ближайшие списания (14 дней)
        </Text>
        {upcoming.length > 0 ? (
          <Stack gap="xs">
            {upcoming.map((ub) => {
              const color = severityColor(ub.severity);
              return (
                <Group key={ub.serviceUuid} justify="space-between" wrap="nowrap">
                  <Text size="sm" c={color} style={{ whiteSpace: 'nowrap' }}>
                    {ub.providerName} — <b>{ub.name}</b>
                    {ub.covered === false && (
                      <Text span size="xs" c="red">
                        {' '}
                        · не хватает баланса
                      </Text>
                    )}
                  </Text>
                  <Group gap="sm" wrap="nowrap">
                    <Badge size="sm" variant="light" color={color ?? 'gray'}>
                      {dayLabel(ub.daysUntil)}
                    </Badge>
                    <Text size="sm" c="dimmed">
                      {formatDateShort(ub.nextBillingAt)}
                    </Text>
                    <Text size="sm" fw={600}>
                      {formatMoney(ub.cost, ub.currency)}
                    </Text>
                  </Group>
                </Group>
              );
            })}
          </Stack>
        ) : (
          <Text c="dimmed" size="sm">
            Нет списаний в ближайшие 14 дней
          </Text>
        )}
      </Card>
    </Stack>
  );
}
