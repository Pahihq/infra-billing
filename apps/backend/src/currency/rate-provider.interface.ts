import type Decimal from 'decimal.js';

export interface RateQuote {
  code: string; // ISO 4217
  perRub: Decimal; // RUB per 1 unit of `code`
}

/** Pluggable exchange-rate source (CBR works in RUB). */
export interface RateProvider {
  source(): string; // "cbr" | "manual"
  fetchRates(signal: AbortSignal): Promise<RateQuote[]>;
}
