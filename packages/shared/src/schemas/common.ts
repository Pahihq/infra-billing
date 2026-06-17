import { z } from 'zod';

export const uuidSchema = z.string().uuid();

/** ISO 4217 currency code, e.g. RUB / USD / EUR. */
export const currencySchema = z.string().regex(/^[A-Z]{3}$/, 'ISO 4217 currency code');

/** ISO 3166-1 alpha-2 country code. */
export const countryCodeSchema = z.string().regex(/^[A-Z]{2}$/, 'ISO 3166-1 alpha-2');

/**
 * Money is transferred as a decimal STRING to preserve NUMERIC(14,2) precision
 * (never a JS number). E.g. "1234.50".
 */
export const moneySchema = z.string().regex(/^-?\d+(\.\d{1,2})?$/, 'decimal string');

/** ISO 8601 datetime string (UTC). The frontend renders it in local time. */
export const isoDateSchema = z.string().datetime({ offset: true });
