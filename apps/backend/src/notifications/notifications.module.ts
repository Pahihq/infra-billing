import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { NotificationsService } from './notifications.service';
import { TelegramService } from './telegram.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [AnalyticsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, TelegramService],
  exports: [TelegramService],
})
export class NotificationsModule {}
