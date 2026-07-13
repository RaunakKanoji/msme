import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-005 Profitability Score — proxy margin and cost-pressure signals from canonical invoices and obligations.
const seed: DimensionScore[] = [
  { id: "profitability_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "PF-••••-6612", label: "Profitability", source_system: "Canonical invoices + obligations", status: "Published", score: 58, band: "Watch", confidence: 66, source_id: "synthetic_profitability_2026_07", source_observed_at: "2026-07-13T10:08:00.000Z", freshness: "Current", completeness: 72, explanation: "A positive but narrowing proxy margin, with rising input costs, places profitability in the Watch band. This is an explainable signal, not a credit decision.", factors: [{ label: "Positive proxy margin", detail: "Sales inflows exceeded purchase and obligation outflows." }, { label: "Cost pressure", detail: "Input-cost outflows grew faster than sales over two quarters." }], last_scored_at: "2026-07-13T10:08:00.000Z", created_at: "2026-07-13T10:08:00.000Z", updated_at: "2026-07-13T10:08:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "profitability_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "PF-••••-1204", label: "Profitability", source_system: "Canonical invoices + obligations", status: "Needs review", score: 44, band: "Stress", confidence: 52, source_id: "synthetic_profitability_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 48, explanation: "The proxy margin turned negative in recent periods on incomplete data, so the score is held for review.", factors: [{ label: "Negative recent margin", detail: "Outflows exceeded sales inflows in the two most recent months." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "profitability_snapshot_demo_001", score_id: "profitability_score_demo_001", source_id: "synthetic_profitability_2026_07", observed_at: "2026-07-13T10:08:00.000Z", freshness: "Current", completeness: 72, score_summary: "Profitability scored 58/100 (Watch) from a proxy-margin analysis; audited financials are not assumed.", coverage_summary: "Two quarters of invoice and obligation flows covered; calculation version recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "profitability_score", auditType: "profitability_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
