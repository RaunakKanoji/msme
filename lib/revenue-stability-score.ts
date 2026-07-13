import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-004 Revenue Stability Score — turnover consistency and seasonality from canonical invoices and GST filings.
const seed: DimensionScore[] = [
  { id: "revenue_stability_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "RV-••••-5518", label: "Revenue stability", source_system: "Canonical invoices + GST filings", status: "Published", score: 74, band: "Healthy", confidence: 78, source_id: "synthetic_revenue_2026_07", source_observed_at: "2026-07-13T10:07:00.000Z", freshness: "Current", completeness: 80, explanation: "Turnover was consistent across quarters with mild, predictable seasonality. This is an explainable signal, not a credit decision.", factors: [{ label: "Consistent turnover", detail: "Quarterly turnover stayed within a narrow band." }, { label: "Predictable seasonality", detail: "A modest festive-quarter uplift recurs each year." }], last_scored_at: "2026-07-13T10:07:00.000Z", created_at: "2026-07-13T10:07:00.000Z", updated_at: "2026-07-13T10:07:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "revenue_stability_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "RV-••••-3390", label: "Revenue stability", source_system: "Canonical invoices + GST filings", status: "Needs review", score: 41, band: "Stress", confidence: 50, source_id: "synthetic_revenue_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 49, explanation: "Turnover swings sharply between periods and two GST periods are missing, so the score is held for review.", factors: [{ label: "Volatile turnover", detail: "Quarter-on-quarter turnover varied widely." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "revenue_stability_snapshot_demo_001", score_id: "revenue_stability_score_demo_001", source_id: "synthetic_revenue_2026_07", observed_at: "2026-07-13T10:07:00.000Z", freshness: "Current", completeness: 80, score_summary: "Revenue stability scored 74/100 (Healthy) from invoice and GST turnover consistency.", coverage_summary: "Four quarters covered across both sources; calculation version recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "revenue_stability_score", auditType: "revenue_stability_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
