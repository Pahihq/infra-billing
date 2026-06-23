import { syncRunSchema } from '@infra/shared';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class SyncRunDto extends createZodDto(syncRunSchema) {}

export const syncSummarySchema = z.object({
  total: z.number().int(),
  ok: z.number().int(),
  failed: z.number().int(),
});
export class SyncSummaryDto extends createZodDto(syncSummarySchema) {}
