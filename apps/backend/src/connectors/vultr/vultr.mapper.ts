import Decimal from 'decimal.js';
import { PaymentData, ServiceData } from '../connector.interface';
import { VultrBillingItem, VultrInstance, VultrPlan } from './vultr.types';

// Vultr denominates everything in USD; no money field carries a currency code.
export const VULTR_CURRENCY = 'USD';

// Price from the instance's plan (`monthly_cost`, USD); plan missing (/plans failed) -> cost unset.
// `region` is a region code (e.g. "sto"); `regions` maps it to ISO-2 (GET /regions). Unknown region
// -> countryCode unset (create defaults to 'XX').
export function mapVultrInstance(
  i: VultrInstance,
  plans: Map<string, VultrPlan>,
  regions: Map<string, string>,
): ServiceData {
  const plan = plans.get(i.plan);
  return {
    externalId: i.id,
    name: i.label || i.main_ip || i.hostname || `vultr-${i.id}`,
    type: 'vps',
    countryCode: regions.get(i.region),
    cost: plan ? new Decimal(plan.monthly_cost) : undefined,
    currency: VULTR_CURRENCY,
    period: 'monthly',
    meta: { ...i },
  };
}

// `payment` rows = top-ups (amount negative, e.g. -10 = $10 added) -> topup; `invoice` rows =
// charges (positive) -> charge. Store abs amount, namespace id by type so top-up/invoice can't
// collide. No instance id on the row -> charges stay at the provider level.
export function mapVultrPayment(b: VultrBillingItem): PaymentData {
  return {
    externalId: `${b.type}:${b.id}`,
    type: b.type === 'payment' ? 'topup' : 'charge',
    amount: new Decimal(Math.abs(b.amount)),
    currency: VULTR_CURRENCY,
    date: new Date(b.date),
    description: b.description || undefined,
  };
}
