import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-011 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("retrain", 0, {"label": "Retraining policy", "version": "pd-retrain-v1", "status": "Adopted", "completeness": 80, "summary": "Retrain on: PSI breach, calibration degradation, definition change, 12 months elapsed, or material data-source change.", "detail": "Champion-challenger promotion requires validation report and model-risk approval; no silent promotion."}),
  seedRecord("retrain", 1, {"label": "Emergency rollback runbook", "version": "pd-rollback-v1", "status": "Adopted", "completeness": 75, "summary": "Rollback restores the previous approved version; assessments store model versions so history stays interpretable.", "detail": "Tested against the version registry in demo mode."}),
];
export const store = createGovernanceStore("retrain", "retraining_strategy", seed);
export const handlers = makeGovernanceHandlers(store, "retraining strategies");
