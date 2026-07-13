import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-003 Liquidity Score — liquidity buffer, low-balance days, and short-term coverage from canonical bank transactions.
const seed: DimensionScore[] = [
  { id: "liquidity_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "LQ-••••-4420", label: "Liquidity", source_system: "Canonical bank transactions", status: "Published", score: 69, band: "Watch", confidence: 80, source_id: "synthetic_liquidity_2026_07", source_observed_at: "2026-07-13T10:06:00.000Z", freshness: "Current", completeness: 82, explanation: "The business holds roughly three weeks of outflow as a liquidity buffer with few low-balance days. This is an explainable signal, not a credit decision.", factors: [{ label: "Buffer days", detail: "Average balance covered about 21 days of typical outflow." }, { label: "Low-balance days", detail: "Balance fell below the working threshold on four days in the year." }], last_scored_at: "2026-07-13T10:06:00.000Z", created_at: "2026-07-13T10:06:00.000Z", updated_at: "2026-07-13T10:06:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "liquidity_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "LQ-••••-8261", label: "Liquidity", source_system: "Canonical bank transactions", status: "Needs review", score: 38, band: "Stress", confidence: 55, source_id: "synthetic_liquidity_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 51, explanation: "Frequent low-balance days and a thin buffer place liquidity under stress; the stale source is held for review.", factors: [{ label: "Thin buffer", detail: "Average balance covered fewer than seven days of outflow." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "liquidity_snapshot_demo_001", score_id: "liquidity_score_demo_001", source_id: "synthetic_liquidity_2026_07", observed_at: "2026-07-13T10:06:00.000Z", freshness: "Current", completeness: 82, score_summary: "Liquidity scored 69/100 (Watch) from balance and buffer analysis over 12 months.", coverage_summary: "Daily balances covered for the full year; calculation version recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "liquidity_score", auditType: "liquidity_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
