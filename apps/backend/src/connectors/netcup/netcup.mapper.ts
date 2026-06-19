import { ServiceData } from '../connector.interface';
import { NetcupServer } from './netcup.types';

/**
 * Map a netcup SCP server to our domain Service. The REST API exposes NO price
 * (server management only), so `cost` is left unset — the owner enters it manually
 * (like Hetzner configurator servers). netcup bills in EUR.
 */
export function mapNetcupServer(s: NetcupServer): ServiceData {
  const externalId = String(s.id ?? s.serverId ?? s.name ?? s.nickname ?? '');
  const name = s.nickname || s.name || s.hostname || `netcup ${externalId}`;
  const countryCode = extractCountry(s);
  return {
    externalId,
    name,
    type: 'vps',
    ...(countryCode ? { countryCode } : {}),
    currency: 'EUR',
    period: 'monthly',
    meta: { ...s },
  };
}

// netcup exposes only the datacenter city (no ISO code). Its DCs: Nuremberg (DE), Vienna (AT),
// Manassas/Virginia (US).
const CITY_COUNTRY: Array<[RegExp, string]> = [
  [/n[üu]rnberg|nuremberg/i, 'DE'],
  [/wien|vienna/i, 'AT'],
  [/manassas/i, 'US'],
];

/** Best-effort ISO 3166-1 alpha-2: from `site.city` first, then loosely-shaped fallbacks. */
function extractCountry(s: NetcupServer): string | undefined {
  const city = s.site?.city;
  if (city) {
    for (const [re, cc] of CITY_COUNTRY) if (re.test(city)) return cc;
  }
  const candidates = [
    typeof s.location === 'object' ? (s.location?.countryCode ?? s.location?.country) : undefined,
    typeof s.datacenter === 'object' ? s.datacenter?.country : undefined,
    typeof s.location === 'string' ? s.location : undefined,
    typeof s.datacenter === 'string' ? s.datacenter : undefined,
    s.region,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && /^[A-Za-z]{2}$/.test(c)) return c.toUpperCase();
  }
  return undefined;
}
