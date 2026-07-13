import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-006 Model Validation Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("model_validation_test_pl", 0, {"label": "Model Validation Test Plan specification", "version": "model-validation-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "Model Validation Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("model_validation_test_pl", 1, {"label": "Model Validation Test Plan extension", "version": "model-validation-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the model validation test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("model_validation_test_pl", "model_validation_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "model validation test plan records");
