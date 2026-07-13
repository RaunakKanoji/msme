import "server-only";
import { getFinancialConfig } from "./financial-config.ts";
import { resolveFinancialSnapshot } from "./fallback.ts";
import { calculateFinancialHealth } from "./financial-health-engine.ts";
import { buildMockSnapshot } from "./providers/mock/mock-data.ts";
import { SetuFinancialProvider } from "./providers/setu/setu-financial-provider.ts";
import { getLatestCachedSnapshot, saveSnapshotToCache } from "./snapshot-cache.ts";
import type { FinancialDataContext, FinancialHealthResult, FinancialSnapshot, ProviderResult } from "./types.ts";
// Single server-side entry point. Pages and route handlers call this — never a provider directly. Wires the pure
// fallback chain to the real Setu adapter, cache seam, deterministic mock generator, and Track 03 engine.
const setu = new SetuFinancialProvider();
export async function getFinancialSnapshot(context: FinancialDataContext): Promise<ProviderResult<FinancialSnapshot>> {
  const cfg = getFinancialConfig();
  return resolveFinancialSnapshot({
    mode: cfg.mode,
    fallbackEnabled: cfg.fallbackEnabled,
    trySetu: () => setu.getFinancialSnapshot(context),
    tryCache: () => getLatestCachedSnapshot(context.businessId),
    buildMock: (opts) => buildMockSnapshot(context.scenario ?? cfg.scenario, context, opts),
    onSetuSuccess: (snapshot) => saveSnapshotToCache(snapshot),
  });
}
export async function getFinancialHealth(context: FinancialDataContext): Promise<ProviderResult<{ snapshot: FinancialSnapshot; health: FinancialHealthResult }>> {
  const result = await getFinancialSnapshot(context);
  if (!result.ok) return result;
  return { ok: true, data: { snapshot: result.data, health: calculateFinancialHealth(result.data) }, source: result.source };
}
export async function getProviderHealthStatus() {
  const cfg = getFinancialConfig();
  const health = await setu.checkHealth();
  const activeFallback = cfg.mode === "mock" ? "mock" : cfg.fallbackEnabled && !health.reachable ? "mock" : null;
  return { configured: health.configured, reachable: health.reachable, providerMode: cfg.mode, fallbackEnabled: cfg.fallbackEnabled, activeFallback, lastSyncAt: health.lastSyncAt ?? null, message: health.message };
}
