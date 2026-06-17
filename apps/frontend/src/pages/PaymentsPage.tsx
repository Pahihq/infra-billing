import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifyError, notifySuccess } from '@/utils/notify';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  useCreatePayment,
  useDeletePayment,
  usePayments,
  type PaymentFilter,
} from '@/api/payments';
import { useServices } from '@/api/services';
import { useProviders } from '@/api/providers';
import { apiErrorMessage } from '@/api/client';
import { CURRENCY_OPTIONS } from '@/constants';
import { formatDateShort, formatMoney } from '@/utils/format';

interface PForm {
  providerUuid: string;
  serviceUuid: string;
  amount: string;
  currency: string;
  paymentDate: string;
  description: string;
}

const toIso = (d: string) => (d ? new Date(`${d}T00:00:00Z`).toISOString() : undefined);
const PAGE_SIZE = 50;

export function PaymentsPage() {
  const { data: providers } = useProviders();
  const [filter, setFilter] = useState<PaymentFilter>({});
  const [page, setPage] = useState(1);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset page only when the filter changes
  useEffect(() => setPage(1), [filter]);
  const { data, isLoading } = usePayments(filter, { page, pageSize: PAGE_SIZE });
  const payments = data?.items ?? [];
  const total = data?.total ?? 0;
  const create = useCreatePayment();
  const del = useDeletePayment();
  const [opened, { open, close }] = useDisclosure(false);

  const providerOptions = (providers ?? []).map((p) => ({ value: p.uuid, label: p.name }));
  const providerName = (uuid: string) => providers?.find((p) => p.uuid === uuid)?.name ?? '';

  const form = useForm<PForm>({
    initialValues: {
      providerUuid: '',
      serviceUuid: '',
      amount: '',
      currency: 'RUB',
      paymentDate: dayjs().format('YYYY-MM-DD'),
      description: '',
    },
    validate: {
      providerUuid: (v) => (v ? null : 'Выберите провайдера'),
      amount: (v) => (/^\d+(\.\d{1,2})?$/.test(v) ? null : 'Сумма вида 100 или 100.50'),
      paymentDate: (v) => (v ? null : 'Укажите дату'),
    },
  });

  const formServices = useServices({ providerUuid: form.values.providerUuid || undefined });
  const serviceOptions = (formServices.data ?? []).map((s) => ({ value: s.uuid, label: s.name }));

  const openCreate = () => {
    form.setValues({
      providerUuid: providerOptions[0]?.value ?? '',
      serviceUuid: '',
      amount: '',
      currency: 'RUB',
      paymentDate: dayjs().format('YYYY-MM-DD'),
      description: '',
    });
    open();
  };

  const submit = form.onSubmit(async (v) => {
    try {
      await create.mutateAsync({
        providerUuid: v.providerUuid,
        serviceUuid: v.serviceUuid || undefined,
        amount: v.amount,
        currency: v.currency,
        paymentDate: toIso(v.paymentDate)!,
        description: v.description || undefined,
      });
      close();
      notifySuccess('Платёж добавлен');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  });

  const doDelete = async (uuid: string) => {
    if (!window.confirm('Удалить платёж?')) return;
    try {
      await del.mutateAsync(uuid);
      notifySuccess('Удалено');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Платежи</Title>
          <Text c="dimmed">Журнал фактических платежей</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreate}
          disabled={providerOptions.length === 0}
        >
          Добавить
        </Button>
      </Group>

      <Group align="flex-end">
        <Select
          label="Провайдер"
          placeholder="Все провайдеры"
          clearable
          data={providerOptions}
          value={filter.providerUuid ?? null}
          onChange={(v) => setFilter((f) => ({ ...f, providerUuid: v ?? undefined }))}
          w={220}
        />
        <DatePickerInput
          label="С"
          placeholder="дд.мм.гггг"
          valueFormat="DD.MM.YYYY"
          clearable
          w={160}
          value={filter.from ? dayjs(filter.from).format('YYYY-MM-DD') : null}
          onChange={(v) => setFilter((f) => ({ ...f, from: v ? toIso(v) : undefined }))}
        />
        <DatePickerInput
          label="По"
          placeholder="дд.мм.гггг"
          valueFormat="DD.MM.YYYY"
          clearable
          w={160}
          value={filter.to ? dayjs(filter.to).format('YYYY-MM-DD') : null}
          onChange={(v) => setFilter((f) => ({ ...f, to: v ? toIso(v) : undefined }))}
        />
      </Group>

      <Table.ScrollContainer minWidth={720}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Провайдер</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Описание</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {payments.map((p) => (
              <Table.Tr key={p.uuid}>
                <Table.Td>{formatDateShort(p.paymentDate)}</Table.Td>
                <Table.Td>{providerName(p.providerUuid)}</Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                  <Badge
                    variant="light"
                    color={p.type === 'charge' ? 'gray' : 'teal'}
                    styles={{
                      root: { maxWidth: 'none', overflow: 'visible' },
                      label: { overflow: 'visible' },
                    }}
                  >
                    {p.type === 'charge' ? 'списание' : 'платёж'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text fw={600}>{formatMoney(p.amount, p.currency)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {p.description ?? '—'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group justify="flex-end">
                    <ActionIcon variant="subtle" color="red" onClick={() => doDelete(p.uuid)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {!isLoading && total === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text c="dimmed" ta="center" py="md">
                    Нет платежей
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {total > PAGE_SIZE && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Всего: {total}
          </Text>
          <Pagination total={Math.ceil(total / PAGE_SIZE)} value={page} onChange={setPage} />
        </Group>
      )}

      <Modal opened={opened} onClose={close} title="Новый платёж">
        <form onSubmit={submit}>
          <Stack>
            <Select
              label="Провайдер"
              data={providerOptions}
              allowDeselect={false}
              {...form.getInputProps('providerUuid')}
            />
            <Select
              label="Сервис (необязательно)"
              placeholder="—"
              clearable
              data={serviceOptions}
              {...form.getInputProps('serviceUuid')}
            />
            <Group grow>
              <TextInput label="Сумма" required {...form.getInputProps('amount')} />
              <Select
                label="Валюта"
                data={CURRENCY_OPTIONS}
                allowDeselect={false}
                {...form.getInputProps('currency')}
              />
            </Group>
            <DatePickerInput
              label="Дата"
              required
              valueFormat="DD.MM.YYYY"
              placeholder="дд.мм.гггг"
              value={form.values.paymentDate || null}
              onChange={(v) => form.setFieldValue('paymentDate', v ?? '')}
              error={form.errors.paymentDate}
            />
            <Textarea
              label="Описание"
              autosize
              minRows={2}
              {...form.getInputProps('description')}
            />
            <Button type="submit" loading={create.isPending}>
              Сохранить
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
