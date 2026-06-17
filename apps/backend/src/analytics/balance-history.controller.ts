import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { API, API_SUB, ID_PARAM } from '@infra/shared';
import { AnalyticsService } from './analytics.service';
import { BalanceHistoryQueryDto } from './dto/analytics.dto';

@Controller(API.PROVIDERS)
export class BalanceHistoryController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get(API_SUB.PROVIDER_BALANCE_HISTORY)
  history(@Param(ID_PARAM, ParseUUIDPipe) uuid: string, @Query() query: BalanceHistoryQueryDto) {
    return this.analytics.balanceHistory(uuid, query.from, query.to);
  }
}
