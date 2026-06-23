// Aeza API v2 response shapes (https://my.aeza.net/api/v2). Only consumed fields are typed.
// Money is in minor currency units (cents/kopecks) → divide by 100. Lists wrap as { items, total }.

export interface AezaPaged<T> {
  items: T[];
  total: number;
}

export interface AezaAccount {
  balance: number; // minor units; prepaid (positive = available funds)
  currency: string; // ISO 4217, e.g. "RUB" / "USD" / "EUR"
}

export interface AezaService {
  id: number;
  name: string;
  ip?: string;
  price: number; // minor units, per paymentTerm
  paymentTerm: string; // hour|half_day|day|week|month|quarter_year|half_year|year|eternal
  expiresAt?: string; // ISO timestamp
  status: string; // active | suspended | deleted | ...
  typeSlug: string; // e.g. "vps"
  locationCode?: string; // ISO 3166-1 alpha-2, e.g. "de"
  productName?: string;
  autoProlong?: boolean;
  [key: string]: unknown;
}

export interface AezaTransaction {
  id: number;
  amount: number; // minor units
  type: string; // replenishment | prolong | buy | order | refund | compensation | manual | ...
  status: string; // created | performed | cancelled
  performedAt?: string;
  createdAt?: string;
  serviceId?: number; // parent service, for charges
}
