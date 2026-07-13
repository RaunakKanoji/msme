import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-003 E2E Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("e2e_test_plan", 0, {"label": "E2E Test Plan specification", "version": "e2e-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "E2E Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("e2e_test_plan", 1, {"label": "E2E Test Plan extension", "version": "e2e-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the e2e test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("e2e_test_plan", "e2e_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "e2e test plan records");
