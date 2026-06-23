import { createZodDto } from 'nestjs-zod';
import { healthSchema } from '@infra/shared';

export class HealthDto extends createZodDto(healthSchema) {}
