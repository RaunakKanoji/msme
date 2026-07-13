import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-004 API Contract Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("api_contract_test_plan", 0, {"label": "API Contract Test Plan specification", "version": "api-contract-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "API Contract Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("api_contract_test_plan", 1, {"label": "API Contract Test Plan extension", "version": "api-contract-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the api contract test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("api_contract_test_plan", "api_contract_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "api contract test plan records");
