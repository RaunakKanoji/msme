import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-011 Demo Readiness Checklist (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("demo_readiness_checklist", 0, {"label": "Demo Readiness Checklist specification", "version": "demo-readiness-checklist-v1", "status": "Adopted", "completeness": 85, "summary": "Demo Readiness Checklist baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("demo_readiness_checklist", 1, {"label": "Demo Readiness Checklist extension", "version": "demo-readiness-checklist-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the demo readiness checklist baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("demo_readiness_checklist", "demo_readiness_checklist", seed);
export const handlers = makeGovernanceHandlers(store, "demo readiness checklist records");
