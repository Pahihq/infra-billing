export interface PorkbunCredentials {
  apiKey: string;
  secretApiKey: string;
}

/** Every Porkbun response carries a `status` ("SUCCESS" | "ERROR" + code/message). */
export interface PorkbunResponse {
  status?: string;
  code?: string;
  message?: string;
}

export interface BalanceResponse extends PorkbunResponse {
  balance?: number; // account credit in cents
  display?: string; // e.g. "$50.00"
}

export interface PorkbunDomain {
  domain: string;
  status?: string; // e.g. "ACTIVE"
  tld?: string; // without leading dot, e.g. "com"
  createDate?: string; // "YYYY-MM-DD HH:mm:ss"
  expireDate?: string; // renewal date, same format
  securityLock?: number; // 1 = transfer lock on
  whoisPrivacy?: number; // 1 = WHOIS privacy on
  autoRenew?: number; // 1 = auto-renew on
  notLocal?: number; // 1 = externally managed (not registered at Porkbun)
  [key: string]: unknown;
}

export interface ListAllResponse extends PorkbunResponse {
  count?: number;
  domains?: PorkbunDomain[];
}

export interface TldPrice {
  registration?: string; // dollar string, e.g. "9.68"
  renewal?: string;
  transfer?: string;
}

export interface PricingResponse extends PorkbunResponse {
  pricing?: Record<string, TldPrice>;
}
