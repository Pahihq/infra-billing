import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CbrRateProvider } from './cbr.rate-provider';
import { RatesController } from './rates.controller';

@Module({
  controllers: [RatesController],
  providers: [CurrencyService, CbrRateProvider],
  exports: [CurrencyService],
})
export class CurrencyModule {}
