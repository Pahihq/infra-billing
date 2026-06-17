// Timeweb Cloud API response shapes. Only the fields we consume are typed.

export interface FinancesResponse {
  finances: { balance: number | string; currency: string };
}

export interface TimewebServer {
  id: number;
  name: string;
  location?: string;
  preset_id?: number | null;
  [key: string]: unknown;
}

export interface TimewebServersResponse {
  servers: TimewebServer[];
}

export interface TimewebPreset {
  id: number;
  price: number; // monthly tariff in the account currency
  location?: string;
}

export interface PresetsResponse {
  server_presets: TimewebPreset[];
}
