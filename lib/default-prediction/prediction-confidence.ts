import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-009 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("pred_confidence", 0, {"label": "Confidence rule set", "version": "pd-confidence-v1", "status": "Adopted", "completeness": 84, "summary": "Confidence derives from months of history, transaction count, source count, and data completeness; thin-file forces PROVISIONAL.", "detail": "Provisional is a status, not a separate score; high-value decisions route to manual review."}),
  seedRecord("pred_confidence", 1, {"label": "Confidence threshold review", "version": "pd-confidence-review-2026-07", "status": "Needs review", "completeness": 50, "summary": "Review whether 6-month minimum history is sufficient for seasonal businesses.", "detail": "Seasonality analysis pending."}),
];
export const store = createGovernanceStore("pred_confidence", "prediction_confidence", seed);
export const handlers = makeGovernanceHandlers(store, "prediction confidence rules");
