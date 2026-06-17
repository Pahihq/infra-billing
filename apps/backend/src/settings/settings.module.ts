import { Module } from '@nestjs/common';
import { SyncModule } from '../sync/sync.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [SyncModule], // SettingsService re-arms the sync scheduler when the interval changes
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
