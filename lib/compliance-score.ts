import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-006 Compliance Score — GST filing regularity and EPFO remittance timeliness from canonical filings and payroll.
const seed: DimensionScore[] = [
  { id: "compliance_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "CM-••••-7723", label: "Compliance", source_system: "Canonical GST filings + payroll", status: "Published", score: 83, band: "Healthy", confidence: 90, source_id: "synthetic_compliance_2026_07", source_observed_at: "2026-07-13T10:09:00.000Z", freshness: "Current", completeness: 88, explanation: "GST returns and EPFO remittances were filed on time for most periods, indicating strong statutory discipline. This is an explainable signal, not a credit decision.", factors: [{ label: "On-time GST filing", detail: "Returns were filed on time in eleven of twelve months." }, { label: "Regular EPFO remittances", detail: "Payroll contributions were remitted on schedule." }], last_scored_at: "2026-07-13T10:09:00.000Z", created_at: "2026-07-13T10:09:00.000Z", updated_at: "2026-07-13T10:09:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "compliance_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "CM-••••-4451", label: "Compliance", source_system: "Canonical GST filings + payroll", status: "Needs review", score: 62, band: "Watch", confidence: 68, source_id: "synthetic_compliance_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 55, explanation: "Two GST periods are missing and a remittance was delayed; the score is held for review pending fresh data.", factors: [{ label: "Missing periods", detail: "Two monthly GST filings could not be corroborated." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "compliance_snapshot_demo_001", score_id: "compliance_score_demo_001", source_id: "synthetic_compliance_2026_07", observed_at: "2026-07-13T10:09:00.000Z", freshness: "Current", completeness: 88, score_summary: "Compliance scored 83/100 (Healthy) from GST and EPFO timeliness across 12 months.", coverage_summary: "Twelve months of filings and remittances covered; calculation version recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "compliance_score", auditType: "compliance_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
