import Decimal from 'decimal.js';
import { normalizeCurrency } from '../common/currency';
import { PaymentData, ServiceData } from '../connector.interface';
import { CfBillingItem, CfDomain } from './cloudflare.types';

export const CLOUDFLARE_CURRENCY = 'USD';

/**
 * CF registrar domain → domain Service. The Registrar API does not return a price, so we leave
 * cost unset (the owner fills it in; costOverridden then protects it on re-sync). Domains renew
 * yearly; nextBilling = expires_at.
 */
export function mapCfDomain(d: CfDomain): ServiceData {
  return {
    externalId: d.name,
    name: d.name,
    type: 'domain',
    period: 'yearly',
    currency: CLOUDFLARE_CURRENCY,
    nextBilling: d.expires_at ? new Date(d.expires_at) : undefined,
    // no cost (registrar API has no price), no countryCode (domains aren't located)
    meta: {
      registrar: d.current_registrar,
      registry: d.registry,
      autoRenew: d.auto_renew,
      status: d.last_known_status,
    },
  };
}

/** CF billing record → Payment. invoice → charge, payment → topup, amount by absolute value. */
export function mapCfBilling(b: CfBillingItem): PaymentData | null {
  if (!b?.id || b.amount == null || !b.occurred_at) return null;
  if (Number(b.amount) === 0) return null; // skip zero-amount invoices (free-plan months)
  return {
    externalId: `cf:${b.id}`,
    type: b.type === 'payment' ? 'topup' : 'charge',
    amount: new Decimal(Math.abs(Number(b.amount))),
    currency: normalizeCurrency(b.currency, CLOUDFLARE_CURRENCY),
    date: new Date(b.occurred_at),
    description: b.receipt_id ? `Invoice ${b.receipt_id}` : b.type,
  };
}
