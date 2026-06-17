import Decimal from 'decimal.js';
import { ServiceData } from '../connector.interface';
import { FourVpsServer } from './4vps.types';

/** Map a 4VPS server to our domain Service. Price is the MONTHLY tariff in RUB. */
export function mapFourVpsServer(s: FourVpsServer, dcFlags: Map<number, string>): ServiceData {
  const flag = s.dc != null ? dcFlags.get(s.dc) : undefined;
  return {
    externalId: String(s.id),
    name: s.name || s.tname || `server-${s.id}`,
    type: 'vps',
    countryCode: flag && /^[a-z]{2}$/i.test(flag) ? flag.toUpperCase() : undefined,
    cost: s.price != null ? new Decimal(s.price) : undefined,
    currency: 'RUB',
    period: 'monthly',
    // `expired` is a unix timestamp (seconds) of the next charge.
    nextBilling: s.expired ? new Date(s.expired * 1000) : undefined,
    meta: { ...s },
  };
}
