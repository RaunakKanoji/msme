import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-008 Customer Concentration Score — revenue diversification vs top-customer dependence from canonical invoices.
// A higher score means healthier diversification (lower concentration risk).
const seed: DimensionScore[] = [
  { id: "customer_concentration_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "CC-••••-9945", label: "Customer concentration", source_system: "Canonical invoices", status: "Published", score: 51, band: "Watch", confidence: 70, source_id: "synthetic_concentration_2026_07", source_observed_at: "2026-07-13T10:11:00.000Z", freshness: "Current", completeness: 76, explanation: "The top customer contributes a sizeable share of turnover, so diversification is moderate. This is an explainable signal, not a credit decision.", factors: [{ label: "Top-customer share", detail: "The largest customer accounted for roughly a third of turnover." }, { label: "Repeat base", detail: "A stable set of repeat customers supports the remainder." }], last_scored_at: "2026-07-13T10:11:00.000Z", created_at: "2026-07-13T10:11:00.000Z", updated_at: "2026-07-13T10:11:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "customer_concentration_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "CC-••••-2076", label: "Customer concentration", source_system: "Canonical invoices", status: "Needs review", score: 35, band: "Stress", confidence: 45, source_id: "synthetic_concentration_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 44, explanation: "Turnover is heavily concentrated in one buyer on incomplete invoice data, so the score is held for review.", factors: [{ label: "High concentration", detail: "A single buyer accounted for more than half of turnover." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "concentration_snapshot_demo_001", score_id: "customer_concentration_score_demo_001", source_id: "synthetic_concentration_2026_07", observed_at: "2026-07-13T10:11:00.000Z", freshness: "Current", completeness: 76, score_summary: "Customer concentration scored 51/100 (Watch); higher scores indicate healthier diversification.", coverage_summary: "One quarter of invoice counterparties covered (masked); calculation version recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "customer_concentration_score", auditType: "customer_concentration_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
