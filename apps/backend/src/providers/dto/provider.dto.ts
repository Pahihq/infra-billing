import { createZodDto } from 'nestjs-zod';
import { createProviderSchema, updateProviderSchema } from '@infra/shared';

export class CreateProviderDto extends createZodDto(createProviderSchema) {}
export class UpdateProviderDto extends createZodDto(updateProviderSchema) {}
