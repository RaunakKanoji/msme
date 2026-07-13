import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — manual review workflows on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("man_review", 0, {"label": "Manual review routing", "version": "manual-review-v1", "status": "Adopted", "completeness": 85, "summary": "Thin-file, PD 12%+, policy exceptions, and identity conflicts route to the analyst review queue with SLA of 3 working days.", "detail": "Reviewer sees score, PD, factors, policy results, and evidence; decisions recorded with actor and timestamp."}),
  seedRecord("man_review", 1, {"label": "Senior review escalation", "version": "manual-review-escalation-v1", "status": "Adopted", "completeness": 80, "summary": "Exposure above 50L or Critical band escalates to credit manager with maker-checker.", "detail": "Escalation events are audit-logged."}),
];
export const store = createGovernanceStore("man_review", "manual_review_workflow", seed);
export const handlers = makeGovernanceHandlers(store, "manual review workflows");
