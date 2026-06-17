import { z } from 'zod';

/** All process env the backend reads, validated at startup. */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  PORT: z.coerce.number().int().positive().default(8080),

  DATABASE_URL: z.string().min(1),

  // Auth (single-user). Password compared in constant time; session cookie signed
  // with SESSION_SECRET (derived from creds if empty — see AppConfigService).
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  SESSION_SECRET: z.string().default(''),

  // AES-256-GCM key for provider tokens (32 bytes, base64).
  ENCRYPTION_KEY: z.string().min(1),

  // NB: base currency / rate source / sync interval / upcoming-billing days / Telegram are
  // NOT env — they live in the DB `Settings` row (managed in the panel). See SettingsService.

  // Build metadata, baked in by the Docker build args (see Dockerfile/Makefile).
  APP_VERSION: z.string().default('dev'),
  BUILD_TIME: z.string().default(''),
  GIT_COMMIT: z.string().default(''),
});

export type Env = z.infer<typeof envSchema>;
