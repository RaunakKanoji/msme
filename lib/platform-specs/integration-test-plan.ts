import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-002 Integration Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("integration_test_plan", 0, {"label": "Integration Test Plan specification", "version": "integration-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "Integration Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("integration_test_plan", 1, {"label": "Integration Test Plan extension", "version": "integration-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the integration test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("integration_test_plan", "integration_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "integration test plan records");
