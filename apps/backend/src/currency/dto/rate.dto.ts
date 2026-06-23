import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createRateSchema, rateSchema } from '@infra/shared';

export class CreateRateDto extends createZodDto(createRateSchema) {}

export class RateDto extends createZodDto(rateSchema) {}

export class RatesRefreshDto extends createZodDto(z.object({ updated: z.number().int() })) {}
