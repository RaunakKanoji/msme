import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 20-012 Release Gate Checklist (20-testing-release) — governance records on the shared factory.
const seed = [
  seedRecord("release_gate_checklist", 0, {"label": "Release Gate Checklist specification", "version": "release-gate-checklist-v1", "status": "Adopted", "completeness": 85, "summary": "Release Gate Checklist baseline for the 20 testing release batch. This batch contains implementation specifications for quality gates, release validation, and testing strategy.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("release_gate_checklist", 1, {"label": "Release Gate Checklist extension", "version": "release-gate-checklist-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the release gate checklist baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("release_gate_checklist", "release_gate_checklist", seed);
export const handlers = makeGovernanceHandlers(store, "release gate checklist records");
