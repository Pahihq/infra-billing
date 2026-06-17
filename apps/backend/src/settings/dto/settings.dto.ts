import { createZodDto } from 'nestjs-zod';
import { updateSettingsSchema } from '@infra/shared';

export class UpdateSettingsDto extends createZodDto(updateSettingsSchema) {}
