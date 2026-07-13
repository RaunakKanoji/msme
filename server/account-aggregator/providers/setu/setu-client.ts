import "server-only";
import type { SetuConfig } from "./setu-config.ts";
import { getSetuAccessToken, invalidateSetuToken } from "./setu-auth.ts";
import { SetuAuthenticationError, SetuConfigurationError, SetuRateLimitError, SetuUpstreamUnavailableError, SetuValidationError } from "../../errors.ts";
export class SetuClient {
  constructor(private config: SetuConfig) {}
  async request<T>(path: string, init: RequestInit = {}, retryOnAuth = true): Promise<T> {
    const { baseUrl, productInstanceId } = this.config;
    if (!baseUrl || !productInstanceId) throw new SetuConfigurationError();
    const token = await getSetuAccessToken(this.config);
    const response = await fetch(new URL(path, baseUrl), { ...init, cache: "no-store", headers: { "content-type": "application/json", authorization: `Bearer ${token}`, "x-product-instance-id": productInstanceId, ...init.headers } });
    if (response.status === 401 && retryOnAuth) { invalidateSetuToken(this.config); return this.request<T>(path, init, false); }
    if (response.status === 401 || response.status === 403) throw new SetuAuthenticationError();
    if (response.status === 429) throw new SetuRateLimitError();
    if (response.status >= 500) throw new SetuUpstreamUnavailableError();
    if (!response.ok) throw new SetuValidationError();
    return response.json() as Promise<T>;
  }
}
