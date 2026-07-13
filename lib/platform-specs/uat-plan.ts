import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-010 Uat Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("uat_plan", 0, {"label": "Uat Plan specification", "version": "uat-plan-v1", "status": "Adopted", "completeness": 85, "summary": "Uat Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("uat_plan", 1, {"label": "Uat Plan extension", "version": "uat-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the uat plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("uat_plan", "uat_plan", seed);
export const handlers = makeGovernanceHandlers(store, "uat plan records");
