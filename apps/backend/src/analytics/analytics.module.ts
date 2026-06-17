import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { BalanceHistoryController } from './balance-history.controller';

@Module({
  imports: [CurrencyModule],
  controllers: [AnalyticsController, BalanceHistoryController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
