import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const forecastQuerySchema = z.object({
  months: z.coerce.number().int().positive().max(60).default(12),
});
export class ForecastQueryDto extends createZodDto(forecastQuerySchema) {}

export const balanceHistoryQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
export class BalanceHistoryQueryDto extends createZodDto(balanceHistoryQuerySchema) {}
