import { ok } from "./provider-result.ts";
import type { FinancialSnapshot, ProviderMode, ProviderResult } from "./types.ts";
// Pure fallback chain (Section 17). No I/O and no server-only imports, so the auto/setu/mock decision is fully
// unit-testable with injected fakes. The caller wires the real Setu adapter, cache, and mock generator.
export type FallbackDeps = {
  mode: ProviderMode;
  fallbackEnabled: boolean;
  trySetu: () => Promise<ProviderResult<FinancialSnapshot>>;
  tryCache: () => Promise<FinancialSnapshot | null>;
  buildMock: (opts: { isFallback: boolean; message?: string }) => FinancialSnapshot;
  onSetuSuccess?: (snapshot: FinancialSnapshot) => Promise<void>;
};
const FALLBACK_MESSAGE = "Live financial data is temporarily unavailable. Showing demonstration data so you can keep exploring.";
const CACHE_MESSAGE = "Live financial data is temporarily unavailable. Showing the latest saved snapshot.";
export async function resolveFinancialSnapshot(deps: FallbackDeps): Promise<ProviderResult<FinancialSnapshot>> {
  if (deps.mode === "mock") { const snap = deps.buildMock({ isFallback: false }); return ok(snap, snap.metadata); }
  const setu = await deps.trySetu();
  if (setu.ok) { await deps.onSetuSuccess?.(setu.data); return setu; }
  // Setu failed. Try cache only when fallback is enabled.
  if (deps.fallbackEnabled) {
    const cached = await deps.tryCache();
    if (cached) {
      const snap: FinancialSnapshot = { ...cached, metadata: { ...cached.metadata, provider: "database-cache", status: "cached", isFallback: true, isStale: true, message: CACHE_MESSAGE } };
      return ok(snap, snap.metadata);
    }
  }
  // Only "auto" degrades to demonstration data; "setu" mode never silently shows mock.
  if (deps.mode === "auto" && deps.fallbackEnabled) { const snap = deps.buildMock({ isFallback: true, message: FALLBACK_MESSAGE }); return ok(snap, snap.metadata); }
  // setu mode, or fallback disabled → surface the controlled, user-safe provider error.
  return setu;
}
