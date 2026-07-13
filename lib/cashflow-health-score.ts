import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-002 Cashflow Health Score — inflow stability, net cash-flow, and buffer signals from canonical bank transactions.
const seed: DimensionScore[] = [
  { id: "cashflow_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "CF-••••-3311", label: "Cash-flow health", source_system: "Canonical bank transactions", status: "Published", score: 78, band: "Healthy", confidence: 88, source_id: "synthetic_cashflow_2026_07", source_observed_at: "2026-07-13T10:05:00.000Z", freshness: "Current", completeness: 86, explanation: "Inflows were stable across 12 months with a positive net cash-flow margin and adequate liquidity buffer. This is an explainable signal, not a credit decision.", factors: [{ label: "Stable inflows", detail: "Monthly inflows varied within a narrow band over the last year." }, { label: "Positive net margin", detail: "Inflows exceeded outflows in ten of twelve months." }], last_scored_at: "2026-07-13T10:05:00.000Z", created_at: "2026-07-13T10:05:00.000Z", updated_at: "2026-07-13T10:05:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "cashflow_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "CF-••••-9075", label: "Cash-flow health", source_system: "Canonical bank transactions", status: "Needs review", score: 47, band: "Watch", confidence: 60, source_id: "synthetic_cashflow_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 54, explanation: "Two recent months show negative net cash-flow and the source is stale, so the score is held for analyst review.", factors: [{ label: "Recent shortfalls", detail: "Outflows exceeded inflows in the two most recent months." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "cashflow_snapshot_demo_001", score_id: "cashflow_score_demo_001", source_id: "synthetic_cashflow_2026_07", observed_at: "2026-07-13T10:05:00.000Z", freshness: "Current", completeness: 86, score_summary: "Cash-flow health scored 78/100 (Healthy) from 12 months of normalized transactions.", coverage_summary: "Twelve continuous months covered; the calculation version and inputs are recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "cashflow_score", auditType: "cashflow_health_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
