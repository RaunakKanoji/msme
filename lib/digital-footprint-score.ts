import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-009 Digital Footprint Score — share of digital collections and acceptance breadth from UPI summaries and bank data.
const seed: DimensionScore[] = [
  { id: "digital_footprint_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "DF-••••-1056", label: "Digital footprint", source_system: "UPI summary + canonical bank transactions", status: "Published", score: 66, band: "Watch", confidence: 72, source_id: "synthetic_digital_2026_07", source_observed_at: "2026-07-13T10:12:00.000Z", freshness: "Current", completeness: 77, explanation: "A majority of collections are digital across several channels, indicating a growing but not yet dominant digital footprint. This is an explainable signal, not a credit decision.", factors: [{ label: "Digital collections share", detail: "Most receipts arrived via UPI and bank transfer rather than cash." }, { label: "Acceptance breadth", detail: "Collections spanned multiple digital channels." }], last_scored_at: "2026-07-13T10:12:00.000Z", created_at: "2026-07-13T10:12:00.000Z", updated_at: "2026-07-13T10:12:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "digital_footprint_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "DF-••••-6318", label: "Digital footprint", source_system: "UPI summary + canonical bank transactions", status: "Needs review", score: 50, band: "Watch", confidence: 58, source_id: "synthetic_digital_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 50, explanation: "Digital collections dipped and the UPI summary is stale, so the score is held for review.", factors: [{ label: "Lower digital share", detail: "A larger share of recent collections was non-digital." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "digital_snapshot_demo_001", score_id: "digital_footprint_score_demo_001", source_id: "synthetic_digital_2026_07", observed_at: "2026-07-13T10:12:00.000Z", freshness: "Current", completeness: 77, score_summary: "Digital footprint scored 66/100 (Watch) from digital-collection share and channel breadth.", coverage_summary: "Aggregated UPI summaries only (no payer identifiers); calculation version recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "digital_footprint_score", auditType: "digital_footprint_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
