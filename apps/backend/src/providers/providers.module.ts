import { Module } from '@nestjs/common';
import { NetcupDeviceFlowService } from '../connectors/netcup/netcup.device-flow';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, NetcupDeviceFlowService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
