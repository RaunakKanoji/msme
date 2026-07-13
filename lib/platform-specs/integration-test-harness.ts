import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 13-008 Integration Test Harness (13-sandbox-integrations) — governance records on the shared factory.
const seed = [
  seedRecord("integration_test_harness", 0, {"label": "Integration Test Harness specification", "version": "integration-test-harness-v1", "status": "Adopted", "completeness": 85, "summary": "Integration Test Harness baseline for the 13 sandbox integrations batch. This batch contains implementation specifications for IDBI sandbox and synthetic-data integration readiness.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("integration_test_harness", 1, {"label": "Integration Test Harness extension", "version": "integration-test-harness-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the integration test harness baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("integration_test_harness", "integration_test_harness", seed);
export const handlers = makeGovernanceHandlers(store, "integration test harness records");
