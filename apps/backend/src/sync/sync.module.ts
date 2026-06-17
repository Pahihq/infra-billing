import { Module } from '@nestjs/common';
import { ConnectorsModule } from '@connectors/connectors.module';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [ConnectorsModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
