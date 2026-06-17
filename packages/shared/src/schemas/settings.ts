import { z } from 'zod';
import { rateSourceSchema } from '../enums';
import { currencySchema } from './common';

export const settingsSchema = z.object({
  baseCurrency: currencySchema,
  syncIntervalHours: z.number().int().positive(),
  rateSource: rateSourceSchema,
  // Telegram notifications. The bot token is NEVER returned — only whether it's set.
  notificationsEnabled: z.boolean(),
  upcomingBillingDays: z.number().int().positive(),
  telegramChatId: z.string().nullable(),
  telegramTopicId: z.string().nullable(),
  telegramConfigured: z.boolean(),
});
export type Settings = z.infer<typeof settingsSchema>;

export const updateSettingsSchema = z.object({
  baseCurrency: currencySchema.optional(),
  syncIntervalHours: z.number().int().positive().optional(),
  rateSource: rateSourceSchema.optional(),
  notificationsEnabled: z.boolean().optional(),
  upcomingBillingDays: z.number().int().min(1).max(60).optional(),
  // Plaintext token to set/update; empty string or omitted = keep the existing token.
  telegramBotToken: z.string().optional(),
  // Empty string clears the field.
  telegramChatId: z.string().optional(),
  telegramTopicId: z.string().optional(),
});
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;
