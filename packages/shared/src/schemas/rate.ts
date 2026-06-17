import { z } from 'zod';
import { rateSourceSchema } from '../enums';
import { currencySchema, isoDateSchema } from './common';

/** Exchange-rate value: RUB per 1 unit of `code`. Decimal string (≤8 dp). */
export const rateValueSchema = z.string().regex(/^\d+(\.\d{1,8})?$/, 'positive decimal string');

export const rateSchema = z.object({
  code: currencySchema,
  base: currencySchema,
  rate: rateValueSchema,
  source: rateSourceSchema,
  capturedAt: isoDateSchema,
});
export type Rate = z.infer<typeof rateSchema>;

/** Manual rate entry (RUB per 1 unit of `code`). */
export const createRateSchema = z.object({
  code: currencySchema,
  rate: rateValueSchema,
});
export type CreateRate = z.infer<typeof createRateSchema>;
