// Telegram notification message templates — kept here so formats and emoji are easy to change in
// one place. All messages use HTML parse_mode (grammY Api). To use a custom Telegram emoji, replace
// an EMOJI value with a <tg-emoji> tag, e.g.
//   lowBalance: '<tg-emoji emoji-id="5368324170671202286">⚠️</tg-emoji>'
// (the bot must have access to that custom emoji; the inner text is the fallback).

import type { AnalyticsSummary } from '@infra/shared';

type UpcomingBilling = AnalyticsSummary['upcomingBillings'][number];

/** Leading emoji per alert type — swap to <tg-emoji emoji-id="…">…</tg-emoji> for custom ones. */
export const EMOJI = {
  lowBalance: '⚠️',
  upcoming: '🗓',
  syncError: '❌',
  test: '✅',
} as const;

/** Escape user-provided values for Telegram HTML. */
export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Low balance: an imminent charge the provider balance won't cover. */
export function lowBalanceMessage(ub: UpcomingBilling, baseCurrency: string): string {
  const when = ub.daysUntil === 0 ? 'сегодня' : `через ${ub.daysUntil} дн.`;
  return (
    `${EMOJI.lowBalance} <b>Низкий баланс</b>\n` +
    `${esc(ub.providerName)} — <b>${esc(ub.name)}</b>\n` +
    `Не хватит на списание <code>${esc(ub.costBase)} ${esc(baseCurrency)}</code> (${when})\n` +
    `Баланс: <code>${esc(ub.providerBalance ?? '0')} ${esc(ub.providerBalanceCurrency ?? '')}</code>`
  );
}

/** Upcoming charge reminder (regardless of coverage). `day` is YYYY-MM-DD. */
export function upcomingBillingMessage(ub: UpcomingBilling, day: string): string {
  return (
    `${EMOJI.upcoming} <b>Скоро списание</b>\n` +
    `${esc(ub.providerName)} — <b>${esc(ub.name)}</b>\n` +
    `Дата: <code>${esc(day)}</code>\n` +
    `Сумма: <code>${esc(ub.cost)} ${esc(ub.currency)}</code>`
  );
}

/** Provider sync failure. */
export function syncErrorMessage(providerName: string, error: string): string {
  return (
    `${EMOJI.syncError} <b>Ошибка синхронизации</b>\n` +
    `Провайдер: <b>${esc(providerName)}</b>\n` +
    `<code>${esc(error)}</code>`
  );
}

/** Manual "test" send to verify the Telegram configuration. */
export function testMessage(): string {
  return `${EMOJI.test} <b>Infra Billing</b>: тестовое уведомление`;
}

/**
 * One sample of EVERY notification type (with obvious demo data) — used by the "test" send so you
 * can preview all formats/emoji in Telegram at once. Not throttled, not persisted.
 */
export function sampleMessages(): string[] {
  const inTwoDays = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
  const sample: UpcomingBilling = {
    serviceUuid: '00000000-0000-0000-0000-000000000000',
    name: 'demo-vps',
    providerName: 'Пример провайдера',
    nextBillingAt: `${inTwoDays}T00:00:00.000Z`,
    cost: '500.00',
    currency: 'RUB',
    costBase: '500.00',
    daysUntil: 2,
    providerBalance: '120.00',
    providerBalanceCurrency: 'RUB',
    covered: false,
    severity: 'critical',
  };
  return [
    `${EMOJI.test} <b>Тест уведомлений</b> — ниже примеры всех типов:`,
    lowBalanceMessage(sample, 'RUB'),
    upcomingBillingMessage(sample, inTwoDays),
    syncErrorMessage('Пример провайдера', 'HTTP 401: неверный API-токен'),
  ];
}
