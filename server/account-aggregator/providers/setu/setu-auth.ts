import "server-only";
import { z } from "zod";
import type { SetuConfig } from "./setu-config.ts";
import { SetuAuthenticationError, SetuConfigurationError } from "../../errors.ts";
// Setu OAuth: POST { clientID, secret } -> { data: { token, expiresIn } }. Token is a short-lived (default 1800s)
// Bearer sent as `Authorization: Bearer <token>` alongside `x-product-instance-id` on every AA API call.
const tokenResponseSchema = z.object({ data: z.object({ token: z.string(), expiresIn: z.number() }) });
type CachedToken = { token: string; expiresAt: number };
const cache = new Map<string, CachedToken>();
function cacheKey(config: SetuConfig) { return `${config.authBaseUrl}:${config.clientId ?? ""}:${config.productInstanceId ?? ""}`; }
export function invalidateSetuToken(config: SetuConfig) { cache.delete(cacheKey(config)); }
export async function getSetuAccessToken(config: SetuConfig): Promise<string> {
  if (!config.clientId || !config.clientSecret) throw new SetuConfigurationError("Setu client credentials are not configured.");
  const key = cacheKey(config);
  const existing = cache.get(key);
  if (existing && existing.expiresAt > Date.now()) return existing.token;
  const response = await fetch(new URL("/api/v2/auth/token", config.authBaseUrl), { method: "POST", cache: "no-store", headers: { "content-type": "application/json" }, body: JSON.stringify({ clientID: config.clientId, secret: config.clientSecret }) });
  if (!response.ok) throw new SetuAuthenticationError();
  const parsed = tokenResponseSchema.safeParse(await response.json());
  if (!parsed.success) throw new SetuAuthenticationError();
  const { token, expiresIn } = parsed.data.data;
  // Refresh ~60s before the server-side expiry to avoid using a token that lapses mid-request.
  cache.set(key, { token, expiresAt: Date.now() + Math.max(0, expiresIn - 60) * 1000 });
  return token;
}
