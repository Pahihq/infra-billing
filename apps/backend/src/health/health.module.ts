import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { BuildInfoController } from './build-info.controller';

@Module({
  controllers: [HealthController, BuildInfoController],
})
export class HealthModule {}
