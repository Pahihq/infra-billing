import Decimal from 'decimal.js';
import { ServiceData } from '../connector.interface';
import { HetznerServer } from './hetzner.types';

/** Map a Hetzner Cloud server to our domain Service (price = monthly cap, gross/EUR). */
export function mapHetznerServer(s: HetznerServer): ServiceData {
  const locName = s.datacenter?.location?.name;
  const country = s.datacenter?.location?.country;
  const price =
    s.server_type?.prices?.find((p) => p.location === locName) ?? s.server_type?.prices?.[0];
  const monthly = price?.price_monthly?.gross;
  const hourly = price?.price_hourly?.gross;
  return {
    externalId: String(s.id),
    name: s.name,
    type: 'vps',
    countryCode: country && /^[A-Z]{2}$/.test(country) ? country : undefined,
    // price_monthly is the monthly cap of hourly billing (gross, incl. VAT).
    cost: monthly ? new Decimal(monthly) : undefined,
    currency: 'EUR',
    period: 'monthly',
    meta: price
      ? {
          ...s,
          _tariff: { serverType: s.server_type?.name, priceMonthly: monthly, priceHourly: hourly },
        }
      : { ...s },
  };
}
