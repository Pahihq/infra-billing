import { createZodDto } from 'nestjs-zod';
import {
  createProviderSchema,
  netcupDevicePollResultSchema,
  netcupDevicePollSchema,
  netcupDeviceStartSchema,
  providerSchema,
  serviceSchema,
  updateProviderSchema,
} from '@infra/shared';
import { z } from 'zod';

export class CreateProviderDto extends createZodDto(createProviderSchema) {}
export class UpdateProviderDto extends createZodDto(updateProviderSchema) {}
export class NetcupDevicePollDto extends createZodDto(netcupDevicePollSchema) {}

export class ProviderDto extends createZodDto(providerSchema) {}
export class ProviderWithServicesDto extends createZodDto(
  providerSchema.extend({ services: z.array(serviceSchema) }),
) {}
export class NetcupDeviceStartDto extends createZodDto(netcupDeviceStartSchema) {}
export class NetcupDevicePollResultDto extends createZodDto(netcupDevicePollResultSchema) {}
