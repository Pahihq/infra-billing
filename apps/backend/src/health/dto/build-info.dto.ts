import { createZodDto } from 'nestjs-zod';
import { buildInfoSchema } from '@infra/shared';

export class BuildInfoDto extends createZodDto(buildInfoSchema) {}
