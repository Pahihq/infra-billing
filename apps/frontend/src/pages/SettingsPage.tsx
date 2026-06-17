import { useEffect } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifyError, notifySuccess } from '@/utils/notify';
import { IconBrandTelegram, IconPlus, IconRefresh, IconSend } from '@tabler/icons-react';
import type { RateSource } from '@infra/shared';
import { useSettings, useUpdateSettings, useTestTelegram } from '@/api/settings';
import { useAddRate, useRates, useRefreshRates } from '@/api/rates';
import { apiErrorMessage } from '@/api/client';
import { CURRENCY_OPTIONS } from '@/constants';
import { formatDate } from '@/utils/format';

const RATE_SOURCE_OPTIONS = [
  { value: 'cbr', label: 'ЦБ РФ (автоматически)' },
  { value: 'manual', label: 'Ручной ввод' },
];

interface SettingsForm {
  baseCurrency: string;
  syncIntervalHours: number;
  rateSource: string;
}

export function SettingsPage() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const testTelegram = useTestTelegram();
  const { data: rates } = useRates();
  const addRate = useAddRate();
  const refresh = useRefreshRates();

  const form = useForm<SettingsForm>({
    initialValues: { baseCurrency: 'RUB', syncIntervalHours: 6, rateSource: 'cbr' },
  });
  const tgForm = useForm({
    initialValues: {
      notificationsEnabled: true,
      telegramBotToken: '',
      telegramChatId: '',
      telegramTopicId: '',
      upcomingBillingDays: 3,
    },
  });
  const rateForm = useForm({
    initialValues: { code: '', rate: '' },
    validate: {
      code: (v) => (/^[A-Za-z]{3}$/.test(v) ? null : 'Код из 3 букв'),
      rate: (v) => (/^\d+(\.\d{1,8})?$/.test(v) ? null : 'Курс — положительное число'),
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-seed the forms only when settings load
  useEffect(() => {
    if (!settings) return;
    form.setValues({
      baseCurrency: settings.baseCurrency,
      syncIntervalHours: settings.syncIntervalHours,
      rateSource: settings.rateSource,
    });
    // Token is write-only — never prefilled; the rest are.
    tgForm.setValues({
      notificationsEnabled: settings.notificationsEnabled,
      telegramBotToken: '',
      telegramChatId: settings.telegramChatId ?? '',
      telegramTopicId: settings.telegramTopicId ?? '',
      upcomingBillingDays: settings.upcomingBillingDays,
    });
  }, [settings]);

  const saveSettings = form.onSubmit(async (v) => {
    try {
      await updateSettings.mutateAsync({
        baseCurrency: v.baseCurrency,
        syncIntervalHours: v.syncIntervalHours,
        rateSource: v.rateSource as RateSource,
      });
      notifySuccess('Настройки сохранены');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  });

  const saveTelegram = tgForm.onSubmit(async (v) => {
    try {
      await updateSettings.mutateAsync({
        notificationsEnabled: v.notificationsEnabled,
        telegramBotToken: v.telegramBotToken || undefined, // empty = keep existing
        telegramChatId: v.telegramChatId,
        telegramTopicId: v.telegramTopicId,
        upcomingBillingDays: v.upcomingBillingDays,
      });
      tgForm.setFieldValue('telegramBotToken', '');
      notifySuccess('Настройки уведомлений сохранены');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  });

  const doTestTelegram = async () => {
    try {
      const res = await testTelegram.mutateAsync();
      if (res.sent) notifySuccess(`Отправлено примеров уведомлений: ${res.sent}`);
      else if (!res.enabled)
        notifyError('Telegram не настроен — укажите токен и chat ID, затем сохраните');
      else notifyError('Не удалось отправить — проверьте токен и chat ID');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  const submitRate = rateForm.onSubmit(async (v) => {
    try {
      await addRate.mutateAsync({ code: v.code.toUpperCase(), rate: v.rate });
      rateForm.reset();
      notifySuccess('Курс добавлен');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  });

  const doRefresh = async () => {
    try {
      const res = await refresh.mutateAsync();
      notifySuccess(`Обновлено курсов: ${res.updated}`);
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Настройки</Title>
        <Text c="dimmed">Базовая валюта, синхронизация, курсы</Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card withBorder radius="md" padding="lg">
          <form onSubmit={saveSettings}>
            <Stack>
              <Select
                label="Базовая валюта"
                data={CURRENCY_OPTIONS}
                allowDeselect={false}
                {...form.getInputProps('baseCurrency')}
              />
              <NumberInput
                label="Интервал синхронизации (часы)"
                min={1}
                max={168}
                {...form.getInputProps('syncIntervalHours')}
              />
              <Select
                label="Источник курсов"
                data={RATE_SOURCE_OPTIONS}
                allowDeselect={false}
                {...form.getInputProps('rateSource')}
              />
              <Group justify="flex-end">
                <Button type="submit" loading={updateSettings.isPending}>
                  Сохранить
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Group gap="xs" mb="md">
            <IconBrandTelegram size={20} />
            <Text fw={600}>Telegram-уведомления</Text>
            {settings?.telegramConfigured ? (
              <Badge color="teal" variant="light">
                токен задан
              </Badge>
            ) : (
              <Badge color="gray" variant="light">
                не настроен
              </Badge>
            )}
          </Group>
          <form onSubmit={saveTelegram}>
            <Stack>
              <Switch
                label="Уведомления включены"
                description="Выключите, чтобы приостановить рассылку (токен сохранится)"
                checked={tgForm.values.notificationsEnabled}
                onChange={(e) =>
                  tgForm.setFieldValue('notificationsEnabled', e.currentTarget.checked)
                }
              />
              <PasswordInput
                label="Bot token"
                description="Токен бота от @BotFather (шифруется, в API не возвращается)"
                placeholder={
                  settings?.telegramConfigured
                    ? 'задан — оставьте пустым, чтобы не менять'
                    : '123456:ABC-DEF…'
                }
                {...tgForm.getInputProps('telegramBotToken')}
              />
              <TextInput
                label="Chat ID"
                description="ID чата/канала для уведомлений (пусто — отключить)"
                placeholder="-1001234567890"
                {...tgForm.getInputProps('telegramChatId')}
              />
              <TextInput
                label="Topic ID (необязательно)"
                description="ID топика форума, если шлём в топик"
                {...tgForm.getInputProps('telegramTopicId')}
              />
              <NumberInput
                label="Предупреждать о списании за (дней)"
                min={1}
                max={60}
                {...tgForm.getInputProps('upcomingBillingDays')}
              />
              <Group justify="space-between">
                <Button
                  variant="default"
                  leftSection={<IconSend size={16} />}
                  loading={testTelegram.isPending}
                  onClick={doTestTelegram}
                >
                  Отправить примеры
                </Button>
                <Button type="submit" loading={updateSettings.isPending}>
                  Сохранить
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      </SimpleGrid>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <Text fw={600}>Курсы валют (к RUB)</Text>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            loading={refresh.isPending}
            onClick={doRefresh}
          >
            Обновить из ЦБ
          </Button>
        </Group>

        <form onSubmit={submitRate}>
          <Group align="flex-end" mb="md">
            <TextInput label="Код" placeholder="USD" w={120} {...rateForm.getInputProps('code')} />
            <TextInput
              label="Курс (RUB за 1)"
              placeholder="95.50"
              w={160}
              {...rateForm.getInputProps('rate')}
            />
            <Button
              type="submit"
              variant="default"
              leftSection={<IconPlus size={16} />}
              loading={addRate.isPending}
            >
              Добавить вручную
            </Button>
          </Group>
        </form>

        <Table.ScrollContainer minWidth={420}>
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Валюта</Table.Th>
                <Table.Th>Курс</Table.Th>
                <Table.Th>Источник</Table.Th>
                <Table.Th>Обновлён</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rates?.map((r) => (
                <Table.Tr key={r.code}>
                  <Table.Td>{r.code}</Table.Td>
                  <Table.Td>{r.rate}</Table.Td>
                  <Table.Td>{r.source === 'cbr' ? 'ЦБ РФ' : 'ручной'}</Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {formatDate(r.capturedAt)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Stack>
  );
}
