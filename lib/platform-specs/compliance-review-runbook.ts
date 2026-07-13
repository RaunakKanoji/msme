import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 21-009 Compliance Review Runbook (21-operations-support) — governance records on the shared factory.
const seed = [
  seedRecord("compliance_review_runboo", 0, {"label": "Compliance review runbook", "version": "compliance-runbook-v1", "status": "Adopted", "completeness": 86, "summary": "Periodic checks: consent validity sweep, retention policy execution, disclaimer presence, and model-governance attestations.", "detail": "Findings feed the exception register with owners and due dates."}),
  seedRecord("compliance_review_runboo", 1, {"label": "Quarterly attestation checklist", "version": "compliance-attest-v1", "status": "Adopted", "completeness": 78, "summary": "Sign-off checklist for risk, model, and data owners.", "detail": "Demo checklist."}),
];
export const store = createGovernanceStore("compliance_review_runboo", "compliance_review_runbook", seed);
export const handlers = makeGovernanceHandlers(store, "compliance review runbook records");
