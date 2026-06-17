import Decimal from 'decimal.js';
import { normalizeCurrency } from '../common/currency';
import { ServiceData } from '../connector.interface';
import { firstNumber, val } from './billmgr.parse';

/**
 * Resolve the billing period. BILLmanager's numeric `period` is months for standard plans
 * (1/3/12), but daily/hourly plans use negative codes (e.g. -50 = day). The reliable signal is
 * `autoprolong` (the renew-period word: «день»/«месяц»/«год»…), so we use it first and fall
 * back to the numeric months. `cost` is the per-period price (item_cost), kept as-is.
 */
export function resolvePeriod(
  periodStr: string | undefined,
  autoprolong: string | undefined,
  cost: Decimal,
): { period: string; cost: Decimal } {
  const a = (autoprolong ?? '').toLowerCase();
  if (a.includes('ден')) return { period: 'daily', cost }; // день/дня/дней
  if (a.includes('час')) return { period: 'hourly', cost };
  if (a.includes('полгода')) return { period: 'monthly', cost: cost.div(6) };
  if (a.includes('квартал')) return { period: 'quarterly', cost };
  if (a.includes('год') || a.includes('лет')) return { period: 'yearly', cost };
  if (a.includes('месяц') || a.includes('мес')) return { period: 'monthly', cost };

  // Fallback: numeric period in months.
  const m = Number.parseInt(periodStr ?? '', 10);
  if (m === 1) return { period: 'monthly', cost };
  if (m === 3) return { period: 'quarterly', cost };
  if (m === 12) return { period: 'yearly', cost };
  if (m > 0) return { period: 'monthly', cost: cost.div(m) };
  return { period: 'monthly', cost };
}

/** Map a BILLmanager list item (doc.elem) of a given service type to our domain Service. */
export function mapBillmgrService(e: Record<string, unknown>, type: string): ServiceData {
  const id = val(e.id) ?? '';
  const costStr = val(e.item_cost) ?? firstNumber(val(e.cost)) ?? '0';
  const { period, cost } = resolvePeriod(
    val(e.period) ?? val(e.costperiod),
    val(e.autoprolong),
    new Decimal(costStr),
  );
  const expire = val(e.expiredate) ?? val(e.real_expiredate);
  return {
    externalId: String(id),
    // Prefer the domain (what BILLmanager shows in the "Domain name" column); the
    // user-set intname can be non-unique. Fall back to intname/name/pricelist.
    name: val(e.domain) ?? val(e.intname) ?? val(e.name) ?? val(e.pricelist) ?? `service-${id}`,
    type,
    cost,
    currency: normalizeCurrency(val(e.currency_str)),
    period,
    nextBilling: expire ? new Date(expire) : undefined,
    meta: e,
  };
}
