import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '@infra/shared';

export class LoginDto extends createZodDto(loginSchema) {}
