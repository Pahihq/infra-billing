import { z } from 'zod';
import { syncStatusSchema } from '../enums';
import { isoDateSchema, uuidSchema } from './common';

export const syncRunSchema = z.object({
  id: z.string(), // BigInt serialized as string
  providerUuid: uuidSchema,
  status: syncStatusSchema,
  servicesFound: z.number().int(),
  error: z.string().nullable(),
  startedAt: isoDateSchema,
  finishedAt: isoDateSchema.nullable(),
});
export type SyncRun = z.infer<typeof syncRunSchema>;
