import { createZodDto } from 'nestjs-zod';
import { settingsSchema, updateSettingsSchema } from '@infra/shared';

export class UpdateSettingsDto extends createZodDto(updateSettingsSchema) {}

export class SettingsDto extends createZodDto(settingsSchema) {}
