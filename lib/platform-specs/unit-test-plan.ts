import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-001 Unit Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("unit_test_plan", 0, {"label": "Unit Test Plan specification", "version": "unit-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "Unit Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("unit_test_plan", 1, {"label": "Unit Test Plan extension", "version": "unit-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the unit test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("unit_test_plan", "unit_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "unit test plan records");
