import { Controller, Get, Query } from '@nestjs/common';
import { API, API_SUB } from '@infra/shared';
import { AnalyticsService } from './analytics.service';
import { ForecastQueryDto } from './dto/analytics.dto';

@Controller(API.ANALYTICS)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get(API_SUB.ANALYTICS_SUMMARY)
  summary() {
    return this.analytics.summary();
  }

  @Get(API_SUB.ANALYTICS_FORECAST)
  forecast(@Query() query: ForecastQueryDto) {
    return this.analytics.forecast(query.months);
  }
}
