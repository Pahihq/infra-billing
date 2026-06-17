import { createZodDto } from 'nestjs-zod';
import { createRateSchema } from '@infra/shared';

export class CreateRateDto extends createZodDto(createRateSchema) {}
