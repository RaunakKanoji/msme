import assert from "node:assert/strict"; import test from "node:test";
import { buildMockSnapshot, checkSnapshotConsistency } from "../lib/financial-data/providers/mock/mock-data.ts";
import { resolveFinancialSnapshot } from "../lib/financial-data/fallback.ts";
import { calculateFinancialHealth } from "../lib/financial-data/financial-health-engine.ts";
import { getFinancialConfig } from "../lib/financial-data/financial-config.ts";
import { ok, err } from "../lib/financial-data/provider-result.ts";
import type { FinancialSnapshot } from "../lib/financial-data/types.ts";
const ctx = { businessId: "business_test_001" };

test("mock data is deterministic for a scenario", () => {
  const a = buildMockSnapshot("stable-business", ctx, { fetchedAt: "2026-07-13T00:00:00.000Z" });
  const b = buildMockSnapshot("stable-business", ctx, { fetchedAt: "2026-07-13T00:00:00.000Z" });
  assert.equal(a.monthlyRevenue, b.monthlyRevenue);
  assert.equal(a.transactions.length, b.transactions.length);
  assert.equal(a.transactions[0].id, b.transactions[0].id);
  assert.equal(a.netCashFlow, b.netCashFlow);
});

test("mock snapshot is internally consistent (balance chain, unique ids, non-negative totals)", () => {
  for (const scenario of ["stable-business", "healthy-growth", "cash-flow-stress", "high-debt", "seasonal-business", "incomplete-data"] as const) {
    const snap = buildMockSnapshot(scenario, ctx);
    assert.deepEqual(checkSnapshotConsistency(snap), [], `scenario ${scenario} inconsistent`);
    assert.ok(snap.monthlyRevenue > 0 && snap.monthlyExpenses > 0);
  }
});

test("incomplete-data scenario has a shorter history", () => {
  const full = buildMockSnapshot("stable-business", ctx);
  const partial = buildMockSnapshot("incomplete-data", ctx);
  assert.ok(partial.transactions.length < full.transactions.length);
});

const setuSnap = (): FinancialSnapshot => ({ ...buildMockSnapshot("stable-business", ctx), metadata: { provider: "setu", status: "live", isFallback: false, isStale: false, fetchedAt: "2026-07-13T00:00:00.000Z" } });
const deps = (over: Partial<Parameters<typeof resolveFinancialSnapshot>[0]>) => ({ mode: "auto" as const, fallbackEnabled: true, trySetu: async () => err<FinancialSnapshot>("PROVIDER_UNAVAILABLE", "down"), tryCache: async () => null, buildMock: (o: { isFallback: boolean; message?: string }) => buildMockSnapshot("stable-business", ctx, o), ...over });

test("mock mode always returns mock (demo, not fallback)", async () => {
  const r = await resolveFinancialSnapshot(deps({ mode: "mock" }));
  assert.ok(r.ok); assert.equal(r.source.provider, "mock"); assert.equal(r.source.status, "demo"); assert.equal(r.source.isFallback, false);
});

test("auto mode uses Setu when Setu succeeds, and caches it", async () => {
  let saved = false;
  const r = await resolveFinancialSnapshot(deps({ mode: "auto", trySetu: async () => ok(setuSnap(), setuSnap().metadata), onSetuSuccess: async () => { saved = true; } }));
  assert.ok(r.ok); assert.equal(r.source.provider, "setu"); assert.equal(r.source.status, "live"); assert.equal(saved, true);
});

test("auto mode uses cache when Setu fails and cache exists", async () => {
  const r = await resolveFinancialSnapshot(deps({ mode: "auto", tryCache: async () => buildMockSnapshot("stable-business", ctx) }));
  assert.ok(r.ok); assert.equal(r.source.provider, "database-cache"); assert.equal(r.source.status, "cached"); assert.equal(r.source.isStale, true); assert.equal(r.source.isFallback, true);
});

test("auto mode uses mock when Setu and cache are unavailable", async () => {
  const r = await resolveFinancialSnapshot(deps({ mode: "auto" }));
  assert.ok(r.ok); assert.equal(r.source.provider, "mock"); assert.equal(r.source.status, "demo"); assert.equal(r.source.isFallback, true);
});

test("setu mode returns a controlled error when fallback is disabled", async () => {
  const r = await resolveFinancialSnapshot(deps({ mode: "setu", fallbackEnabled: false }));
  assert.equal(r.ok, false); if (!r.ok) assert.equal(r.error.code, "PROVIDER_UNAVAILABLE");
});

test("setu mode never silently returns mock, even with fallback enabled", async () => {
  const r = await resolveFinancialSnapshot(deps({ mode: "setu", fallbackEnabled: true }));
  assert.equal(r.ok, false);
});

test("health engine scores both mock and setu-shaped snapshots through one path", () => {
  for (const snap of [buildMockSnapshot("stable-business", ctx), setuSnap()]) {
    const health = calculateFinancialHealth(snap);
    assert.ok(health.overallScore >= 0 && health.overallScore <= 100);
    assert.equal(health.metrics.length, 6);
    assert.ok(["excellent", "healthy", "stable", "needs-attention", "critical"].includes(health.category));
    assert.equal(health.source.provider, snap.metadata.provider);
  }
});

test("config defaults and env overrides resolve correctly", () => {
  assert.deepEqual(getFinancialConfig({}), { mode: "auto", fallbackEnabled: true, scenario: "stable-business" });
  assert.deepEqual(getFinancialConfig({ FINANCIAL_DATA_PROVIDER: "mock", FINANCIAL_DATA_FALLBACK_ENABLED: "false", FINANCIAL_DATA_MOCK_SCENARIO: "high-debt" }), { mode: "mock", fallbackEnabled: false, scenario: "high-debt" });
});
