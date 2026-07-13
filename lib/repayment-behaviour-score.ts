import { createDimensionStore, DIMENSION_STATUSES, type DimensionScore, type DimensionSnapshot } from "./health-score-dimension.ts";
import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId, DIMENSION_STATUSES };
// 05-007 Repayment Behaviour Score — EMI regularity and bounced-debit signals from canonical obligations and bank
// transactions. This is a behavioural signal from observed payments, not a bureau finding or a credit decision.
const seed: DimensionScore[] = [
  { id: "repayment_behaviour_score_demo_001", business_name: "Saraswati Precision Works", masked_reference: "RB-••••-8834", label: "Repayment behaviour", source_system: "Canonical obligations + bank transactions", status: "Published", score: 72, band: "Healthy", confidence: 74, source_id: "synthetic_repayment_2026_07", source_observed_at: "2026-07-13T10:10:00.000Z", freshness: "Current", completeness: 79, explanation: "Recurring EMIs were paid on schedule with no observed bounced debits over the period. This is a behavioural signal from consented data, not a bureau finding.", factors: [{ label: "Regular EMIs", detail: "All four active obligations show on-schedule instalment debits." }, { label: "No bounced debits", detail: "No returned or failed mandate debits were observed." }], last_scored_at: "2026-07-13T10:10:00.000Z", created_at: "2026-07-13T10:10:00.000Z", updated_at: "2026-07-13T10:10:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "repayment_behaviour_score_demo_002", business_name: "Nair Textiles LLP", masked_reference: "RB-••••-5140", label: "Repayment behaviour", source_system: "Canonical obligations + bank transactions", status: "Needs review", score: 40, band: "Stress", confidence: 48, source_id: "synthetic_repayment_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 47, explanation: "One obligation could not be matched to a source payment and a mandate debit was delayed; the score is held for review.", factors: [{ label: "Delayed debit", detail: "An instalment debit was late in one recent month." }], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DimensionSnapshot[] = [
  { id: "repayment_snapshot_demo_001", score_id: "repayment_behaviour_score_demo_001", source_id: "synthetic_repayment_2026_07", observed_at: "2026-07-13T10:10:00.000Z", freshness: "Current", completeness: 79, score_summary: "Repayment behaviour scored 72/100 (Healthy) from observed instalment regularity.", coverage_summary: "Twelve months of matched obligation debits covered; no missed-payment inference beyond observed data.", immutable: true },
];
const store = createDimensionStore({ prefix: "repayment_behaviour_score", auditType: "repayment_behaviour_score", seed, snapshots });
export const listScores = store.list;
export const getScore = store.get;
export const createScore = store.create;
export const updateScore = store.update;
export const scoreAuditCount = store.auditCount;
