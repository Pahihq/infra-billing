/** Keycloak token response (realm `scp`, refresh_token grant). */
export interface TokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
}

/**
 * A server from `GET /scp-core/api/v1/servers`. The new REST API is not formally
 * documented (the community CLI prints the JSON as-is), so we type the fields we map
 * loosely and keep the rest via the index signature → dumped into `meta`.
 */
export interface NetcupServer {
  id?: number | string;
  serverId?: number | string;
  name?: string;
  nickname?: string;
  hostname?: string;
  state?: string;
  status?: string;
  // Datacenter location. Per the scp-core OpenAPI, the detail endpoint returns `site` with a
  // `city` (e.g. "Nuremberg"/"Vienna") — there is no ISO country in the API, so we derive it.
  site?: { id?: number; city?: string };
  // Older/alternative shapes kept as defensive fallbacks (handled in the mapper).
  datacenter?: string | { name?: string; country?: string; location?: string };
  location?: string | { name?: string; country?: string; countryCode?: string };
  region?: string;
  [key: string]: unknown;
}
