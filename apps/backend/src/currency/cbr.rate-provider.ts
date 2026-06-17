import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Decimal from 'decimal.js';
import { RateProvider, RateQuote } from './rate-provider.interface';

const CBR_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

interface CbrValute {
  Nominal: number;
  Value: number;
  CharCode: string;
}
interface CbrResponse {
  Valute: Record<string, CbrValute>;
}

/** Central Bank of Russia daily rates. Base = RUB; rate of X = Value / Nominal. */
@Injectable()
export class CbrRateProvider implements RateProvider {
  source(): string {
    return 'cbr';
  }

  async fetchRates(signal: AbortSignal): Promise<RateQuote[]> {
    const { data } = await axios.get<CbrResponse>(CBR_URL, { timeout: 10_000, signal });
    const quotes: RateQuote[] = Object.values(data.Valute).map((v) => ({
      code: v.CharCode,
      perRub: new Decimal(v.Value).div(v.Nominal),
    }));
    quotes.push({ code: 'RUB', perRub: new Decimal(1) });
    return quotes;
  }
}
