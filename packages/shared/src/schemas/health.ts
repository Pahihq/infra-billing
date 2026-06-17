import { z } from 'zod';

export const healthSchema = z.object({
  status: z.literal('ok'),
  db: z.literal('up'),
});
export type Health = z.infer<typeof healthSchema>;

export const buildInfoSchema = z.object({
  version: z.string(),
  buildTime: z.string(),
  gitCommit: z.string(),
  nodeVersion: z.string(),
});
export type BuildInfo = z.infer<typeof buildInfoSchema>;
