import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifyError, notifySuccess } from '@/utils/notify';
import { IconEdit, IconExternalLink, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import type { Provider, ProviderKind } from '@infra/shared';
import {
  useCreateProvider,
  useDeleteProvider,
  useProviders,
  useSyncAllProviders,
  useSyncProvider,
  useUpdateProvider,
} from '@/api/providers';
import { apiErrorMessage } from '@/api/client';
import { PROVIDER_KIND_LABELS, PROVIDER_KIND_OPTIONS } from '@/constants';
import { formatDate, formatMoney } from '@/utils/format';
import { providerFavicon } from '@/utils/favicon';
import { ProviderIcon } from '@/components/ProviderIcon';

interface FormValues {
  name: string;
  kind: string;
  token: string;
  loginUrl: string;
  baseUrl: string;
  username: string;
  password: string;
  totpSecret: string;
  accountId: string;
  projectName: string;
  panelId: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  kind: 'manual',
  token: '',
  loginUrl: '',
  baseUrl: '',
  username: '',
  password: '',
  totpSecret: '',
  accountId: '',
  projectName: '',
  panelId: '',
};

export function ProvidersPage() {
  const { data: providers, isLoading } = useProviders();
  const create = useCreateProvider();
  const update = useUpdateProvider();
  const del = useDeleteProvider();
  const sync = useSyncProvider();
  const syncAll = useSyncAllProviders();
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<Provider | null>(null);

  const form = useForm<FormValues>({
    initialValues: EMPTY_FORM,
    validate: { name: (v) => (v.trim() ? null : 'Укажите имя') },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({ ...EMPTY_FORM });
    open();
  };
  const openEdit = (p: Provider) => {
    setEditing(p);
    form.setValues({
      ...EMPTY_FORM,
      name: p.name,
      kind: p.kind,
      loginUrl: p.loginUrl ?? '',
      // Non-secret fields are prefilled; password/totpSecret stay blank ("не менять").
      baseUrl: p.baseUrl ?? '',
      username: p.username ?? '',
      accountId: p.accountId ?? '',
      projectName: p.projectName ?? '',
      panelId: p.panelId ?? '',
    });
    open();
  };

  const submit = form.onSubmit(async (v) => {
    if (
      !editing &&
      (v.kind === 'hostbill' || v.kind === 'billmgr') &&
      !(v.baseUrl && v.username && v.password)
    ) {
      notifyError('Укажите base URL, логин и пароль');
      return;
    }
    if (!editing && v.kind === 'selectel' && !(v.accountId && v.username && v.password)) {
      notifyError('Укажите номер аккаунта, имя пользователя и пароль');
      return;
    }
    if (!editing && v.kind === '4vps' && !v.token) {
      notifyError('Укажите API-токен 4VPS');
      return;
    }
    const creds = {
      token: v.token || undefined,
      baseUrl: v.baseUrl || undefined,
      username: v.username || undefined,
      password: v.password || undefined,
      totpSecret: v.totpSecret || undefined,
      accountId: v.accountId || undefined,
      projectName: v.projectName || undefined,
      panelId: v.panelId || undefined,
    };
    try {
      let saved: Provider;
      if (editing) {
        saved = await update.mutateAsync({
          uuid: editing.uuid,
          dto: { name: v.name, loginUrl: v.loginUrl || undefined, ...creds },
        });
      } else {
        saved = await create.mutateAsync({
          name: v.name,
          kind: v.kind as ProviderKind,
          loginUrl: v.loginUrl || undefined,
          ...creds,
        });
      }
      close();
      notifySuccess(editing ? 'Провайдер обновлён' : 'Провайдер создан');
      // Auto-sync syncable providers so credential/token changes take effect right away.
      if (saved.kind !== 'manual') void doSync(saved.uuid);
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  });

  const doSyncAll = async () => {
    try {
      const res = await syncAll.mutateAsync();
      if (res.failed === 0) notifySuccess(`Синхронизировано провайдеров: ${res.ok}`);
      else notifyError(`Синхронизация: ${res.ok} ок, ${res.failed} с ошибкой`);
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  const doSync = async (uuid: string) => {
    try {
      const run = await sync.mutateAsync(uuid);
      if (run.status === 'ok') notifySuccess(`Синхронизация: сервисов ${run.servicesFound}`);
      else notifyError((run.error ?? '').slice(0, 200) || 'Синхронизация не удалась');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  const doDelete = async (p: Provider) => {
    if (!window.confirm(`Удалить «${p.name}» и все его сервисы/платежи?`)) return;
    try {
      await del.mutateAsync(p.uuid);
      notifySuccess('Удалено');
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Провайдеры</Title>
          <Text c="dimmed">Аккаунты у хостинг-провайдеров</Text>
        </div>
        <Group>
          <Button
            variant="default"
            leftSection={<IconRefresh size={16} />}
            loading={syncAll.isPending}
            onClick={doSyncAll}
          >
            Синхронизировать всё
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Добавить
          </Button>
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={760}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Имя</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Баланс</Table.Th>
              <Table.Th>Сервисов</Table.Th>
              <Table.Th>Платежей</Table.Th>
              <Table.Th>Синхронизация</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {providers?.map((p) => (
              <Table.Tr key={p.uuid}>
                <Table.Td>
                  <Group gap="xs">
                    <ProviderIcon name={p.name} src={providerFavicon(p)} />
                    <Text fw={600}>{p.name}</Text>
                    {p.loginUrl && (
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        component="a"
                        href={p.loginUrl}
                        target="_blank"
                      >
                        <IconExternalLink size={14} />
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color={p.kind === 'manual' ? 'gray' : 'brand'}>
                    {PROVIDER_KIND_LABELS[p.kind]}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatMoney(p.balance, p.balanceCurrency)}</Table.Td>
                <Table.Td>{p.servicesCount ?? 0}</Table.Td>
                <Table.Td>{p.paymentsCount ?? 0}</Table.Td>
                <Table.Td>
                  {p.lastSyncError ? (
                    <Tooltip label={p.lastSyncError} w={260} style={{ whiteSpace: 'normal' }}>
                      <Badge color="red" variant="light">
                        ошибка
                      </Badge>
                    </Tooltip>
                  ) : (
                    <Text size="sm" c="dimmed">
                      {formatDate(p.lastSyncAt)}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    {p.kind !== 'manual' && (
                      <Tooltip label="Обновить">
                        <ActionIcon
                          variant="subtle"
                          loading={sync.isPending}
                          onClick={() => doSync(p.uuid)}
                        >
                          <IconRefresh size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    <ActionIcon variant="subtle" onClick={() => openEdit(p)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => doDelete(p)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {!isLoading && providers?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="md">
                    Нет провайдеров
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Modal
        opened={opened}
        onClose={close}
        title={editing ? 'Редактировать провайдера' : 'Новый провайдер'}
      >
        <form onSubmit={submit}>
          <Stack>
            <TextInput label="Имя" required {...form.getInputProps('name')} />
            {!editing && (
              <Select
                label="Тип"
                data={PROVIDER_KIND_OPTIONS}
                allowDeselect={false}
                {...form.getInputProps('kind')}
              />
            )}
            {form.values.kind === 'selectel' ? (
              <>
                <TextInput
                  label="Номер аккаунта"
                  description="Номер аккаунта Selectel (в правом верхнем углу панели)"
                  placeholder="123456"
                  {...form.getInputProps('accountId')}
                />
                <TextInput
                  label="Имя пользователя (сервисный)"
                  description="Сервисный пользователь IAM: Профиль → Управление пользователями"
                  {...form.getInputProps('username')}
                />
                <PasswordInput
                  label="Пароль"
                  placeholder={editing ? 'оставьте пустым, чтобы не менять' : ''}
                  {...form.getInputProps('password')}
                />
                <TextInput
                  label="Проект (необязательно)"
                  description="Имя проекта Облачной платформы — для импорта облачных серверов"
                  placeholder="my-project"
                  {...form.getInputProps('projectName')}
                />
              </>
            ) : form.values.kind === 'hostbill' || form.values.kind === 'billmgr' ? (
              <>
                <TextInput
                  label="API base URL"
                  placeholder={
                    form.values.kind === 'billmgr'
                      ? 'https://my.akenai.host/billmgr'
                      : 'https://secure.veesp.com/api'
                  }
                  {...form.getInputProps('baseUrl')}
                />
                <TextInput label="Логин (email)" {...form.getInputProps('username')} />
                <PasswordInput
                  label="Пароль"
                  placeholder={editing ? 'оставьте пустым, чтобы не менять' : ''}
                  {...form.getInputProps('password')}
                />
                {form.values.kind === 'billmgr' && (
                  <PasswordInput
                    label="TOTP-секрет (если включена 2FA по OTP)"
                    description="Base32-секрет из приложения-аутентификатора — синк будет сам генерировать код"
                    placeholder={editing ? 'оставьте пустым, чтобы не менять' : 'необязательно'}
                    {...form.getInputProps('totpSecret')}
                  />
                )}
              </>
            ) : form.values.kind === '4vps' ? (
              <>
                <TextInput
                  label="API-токен"
                  description="Личный кабинет 4VPS → раздел API"
                  placeholder={editing ? 'оставьте пустым, чтобы не менять' : ''}
                  {...form.getInputProps('token')}
                />
                <TextInput
                  label="ID панели"
                  description="panel_id — обычно 1"
                  placeholder="1"
                  {...form.getInputProps('panelId')}
                />
              </>
            ) : (
              form.values.kind !== 'manual' && (
                <TextInput
                  label="API-токен"
                  placeholder={editing ? 'оставьте пустым, чтобы не менять' : ''}
                  {...form.getInputProps('token')}
                />
              )
            )}
            <TextInput label="Ссылка на ЛК" {...form.getInputProps('loginUrl')} />
            <Button type="submit" loading={create.isPending || update.isPending}>
              Сохранить
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
