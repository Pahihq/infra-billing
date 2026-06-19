import { createZodDto } from 'nestjs-zod';
import { createProviderSchema, netcupDevicePollSchema, updateProviderSchema } from '@infra/shared';

export class CreateProviderDto extends createZodDto(createProviderSchema) {}
export class UpdateProviderDto extends createZodDto(updateProviderSchema) {}
export class NetcupDevicePollDto extends createZodDto(netcupDevicePollSchema) {}
