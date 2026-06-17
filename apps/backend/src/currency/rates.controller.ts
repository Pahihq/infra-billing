import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { API, API_SUB } from '@infra/shared';
import { CurrencyService } from './currency.service';
import { CreateRateDto } from './dto/rate.dto';

@Controller(API.RATES)
export class RatesController {
  constructor(private readonly currency: CurrencyService) {}

  @Get()
  list() {
    return this.currency.listRates();
  }

  @Post()
  @HttpCode(201)
  addManual(@Body() dto: CreateRateDto) {
    return this.currency.addManualRate(dto.code, dto.rate);
  }

  @Post(API_SUB.RATES_REFRESH)
  @HttpCode(200)
  async refresh() {
    return { updated: await this.currency.refreshRates() };
  }
}
