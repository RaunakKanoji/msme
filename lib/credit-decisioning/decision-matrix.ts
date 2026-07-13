import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — decision matrices on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("dec_matrix", 0, {"label": "Recommendation matrix", "version": "decision-matrix-v1", "status": "Adopted", "completeness": 88, "summary": "Health band x PD band grid mapping to Eligible / Conditionally eligible / Manual review / Decline recommended.", "detail": "The matrix never outputs an approval; final approval authority is always a human credit officer."}),
  seedRecord("dec_matrix", 1, {"label": "Small-ticket fast-track matrix", "version": "decision-matrix-fasttrack-v1", "status": "Needs review", "completeness": 40, "summary": "Proposed grid for sub-10L facilities with tightened PD cut-offs.", "detail": "Under review by central credit team."}),
];
export const store = createGovernanceStore("dec_matrix", "decision_matrix", seed);
export const handlers = makeGovernanceHandlers(store, "decision matrices");
