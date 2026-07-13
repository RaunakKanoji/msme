import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-010 Data Sufficiency Confidence — how much to trust the health card given connected sources, coverage, and
// passing data-quality rules. Here the score is the sufficiency percentage; a higher score means more trustworthy.
const seed: DimensionScore[] = [
  { id: "data_sufficiency_demo_001", business_name: "Saraswati Precision Works", masked_reference: "DS-••••-2167", label: "Data sufficiency", source_system: "Data quality rules + feature snapshots", status: "Published", score: 84, band: "Healthy", confidence: 84, source_id: "synthetic_sufficiency_2026_07", source_observed_at: "2026-07-13T10:13:00.000Z", freshness: "Current", completeness: 84, explanation: "Most required sources are connected and current, and the key data-quality rules pass, so the health card can be shown with high confidence.", factors: [{ label: "Sources connected", detail: "Bank, GST, and obligation sources are all connected and current." }, { label: "Rules passing", detail: "The completeness and continuity data-quality rules pass." }], last_scored_at: "2026-07-13T10:13:00.000Z", created_at: "2026-07-13T10:13:00.000Z", updated_at: "2026-07-13T10:13:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "data_sufficiency_demo_002", business_name: "Nair Textiles LLP", masked_reference: "DS-••••-5583", label: "Data sufficiency", source_system: "Data quality rules + feature snapshots", status: "Needs review", score: 52, band: "Watch", confidence: 52, source_id: "synthetic_sufficiency_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 52, explanation: "Two sources are stale and a continuity rule is warning, so the card is held for review and shown with reduced confidence.", factors: [{ label: "Stale sources", detail: "GST and payroll sources have not refreshed recently." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "sufficiency_snapshot_demo_001", score_id: "data_sufficiency_demo_001", source_id: "synthetic_sufficiency_2026_07", observed_at: "2026-07-13T10:13:00.000Z", freshness: "Current", completeness: 84, score_summary: "Data sufficiency is 84% (Healthy): sources connected, coverage adequate, and key data-quality rules passing.", coverage_summary: "Confidence is derived from connected sources, coverage months, and passing rules; recorded immutably.", immutable: true },
];
const store = createDimensionStore({ prefix: "data_sufficiency", auditType: "data_sufficiency_confidence", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
