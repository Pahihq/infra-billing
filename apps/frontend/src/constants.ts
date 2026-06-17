import type { Period, ProviderKind, ServiceType } from '@infra/shared';

export const PERIOD_LABELS: Record<Period, string> = {
  monthly: 'Ежемесячно',
  yearly: 'Ежегодно',
  quarterly: 'Ежеквартально',
  daily: 'Ежедневно',
  hourly: 'Почасово',
  onetime: 'Разово',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  vps: 'VPS',
  dedicated: 'Выделенный сервер',
  domain: 'Домен',
  cdn: 'CDN',
  storage: 'Хранилище',
  db: 'База данных',
  license: 'Лицензия',
  other: 'Другое',
};

export const PROVIDER_KIND_LABELS: Record<ProviderKind, string> = {
  timeweb: 'Timeweb Cloud',
  hetzner: 'Hetzner Cloud',
  hostbill: 'HostBill',
  billmgr: 'ISP BILLmanager',
  selectel: 'Selectel',
  '4vps': '4VPS.SU',
  manual: 'Ручной',
};

export const PERIOD_OPTIONS = (Object.keys(PERIOD_LABELS) as Period[]).map((value) => ({
  value,
  label: PERIOD_LABELS[value],
}));

export const SERVICE_TYPE_OPTIONS = (Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map(
  (value) => ({ value, label: SERVICE_TYPE_LABELS[value] }),
);

export const PROVIDER_KIND_OPTIONS = (Object.keys(PROVIDER_KIND_LABELS) as ProviderKind[]).map(
  (value) => ({ value, label: PROVIDER_KIND_LABELS[value] }),
);

export const CURRENCY_OPTIONS = ['RUB', 'USD', 'EUR', 'KZT', 'CNY'].map((c) => ({
  value: c,
  label: c,
}));
