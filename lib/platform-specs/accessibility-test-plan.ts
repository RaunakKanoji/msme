import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-008 Accessibility Test Plan (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("accessibility_test_plan", 0, {"label": "Accessibility Test Plan specification", "version": "accessibility-test-plan-v1", "status": "Adopted", "completeness": 85, "summary": "Accessibility Test Plan baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("accessibility_test_plan", 1, {"label": "Accessibility Test Plan extension", "version": "accessibility-test-plan-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the accessibility test plan baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("accessibility_test_plan", "accessibility_test_plan", seed);
export const handlers = makeGovernanceHandlers(store, "accessibility test plan records");
