// Provider APIs return localized currency labels ("руб.", "$", "€") rather than ISO 4217 codes.
// This is the shared normalizer (HostBill, BILLmanager); each caller picks the fallback that
// matches its provider's default currency.

const CURRENCY_ALIASES: Record<string, string> = {
  руб: 'RUB',
  р: 'RUB',
  '₽': 'RUB',
  rub: 'RUB',
  $: 'USD',
  usd: 'USD',
  us$: 'USD',
  '€': 'EUR',
  eur: 'EUR',
  '£': 'GBP',
  gbp: 'GBP',
  '₸': 'KZT',
  kzt: 'KZT',
  '₴': 'UAH',
  uah: 'UAH',
};

/**
 * Map a provider currency label to an ISO 4217 code. Already-ISO inputs pass through;
 * unknown labels fall back to `fallback` (e.g. USD for HostBill, RUB for BILLmanager).
 */
export function normalizeCurrency(raw?: string, fallback = 'RUB'): string {
  const s = (raw ?? '').trim();
  if (/^[A-Z]{3}$/.test(s)) return s;
  const key = s.toLowerCase().replace(/[.\s]/g, '');
  return CURRENCY_ALIASES[key] ?? fallback;
}
