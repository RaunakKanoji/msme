import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-005 Data Quality Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("data_quality_test_plan", 0, {"label": "Data Quality Test Plan specification", "version": "data-quality-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "Data Quality Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("data_quality_test_plan", 1, {"label": "Data Quality Test Plan extension", "version": "data-quality-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the data quality test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("data_quality_test_plan", "data_quality_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "data quality test plan records");
