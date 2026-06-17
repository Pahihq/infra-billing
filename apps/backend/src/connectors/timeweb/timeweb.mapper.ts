import Decimal from 'decimal.js';
import { ServiceData } from '../connector.interface';
import { TimewebPreset, TimewebServer } from './timeweb.types';

const HOURS_PER_MONTH = 730; // Timeweb hourly_cost ≈ monthly_cost / 730

// Map Timeweb location prefixes (e.g. "ru-1") to ISO 3166-1 alpha-2 codes.
const LOCATION_COUNTRY: Record<string, string> = {
  ru: 'RU',
  pl: 'PL',
  nl: 'NL',
  kz: 'KZ',
  de: 'DE',
};

function locationToCountry(location?: string): string | undefined {
  if (!location) return undefined;
  const prefix = location.split('-')[0]?.toLowerCase();
  return prefix ? LOCATION_COUNTRY[prefix] : undefined;
}

function buildMeta(s: TimewebServer, preset?: TimewebPreset): Record<string, unknown> {
  if (!preset) return { ...s };
  const priceHourly = new Decimal(preset.price).div(HOURS_PER_MONTH).toDecimalPlaces(2).toNumber();
  return { ...s, _tariff: { presetId: preset.id, priceMonthly: preset.price, priceHourly } };
}

/** Map a Timeweb server (+ optional preset tariff) to our domain Service. */
export function mapTimewebServer(
  s: TimewebServer,
  presets: Map<number, TimewebPreset>,
): ServiceData {
  const preset = typeof s.preset_id === 'number' ? presets.get(s.preset_id) : undefined;
  const location = preset?.location ?? s.location;
  return {
    externalId: String(s.id),
    name: s.name,
    type: 'vps',
    countryCode: locationToCountry(location),
    // Preset price is the MONTHLY tariff; Timeweb bills hourly (≈ price / 730).
    cost: preset ? new Decimal(preset.price) : undefined,
    period: 'monthly',
    meta: buildMeta(s, preset),
  };
}
