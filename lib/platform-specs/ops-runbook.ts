import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 21-005 Ops Runbook (21-operations-support) — governance records on the shared factory.
const seed = [
  seedRecord("ops_runbook", 0, {"label": "Platform operations runbook", "version": "ops-runbook-v1", "status": "Adopted", "completeness": 88, "summary": "Standard procedures: daily health checks, sync verification, alert triage order, and escalation contacts.", "detail": "Versioned and reviewed; deviations recorded in post-incident reviews."}),
  seedRecord("ops_runbook", 1, {"label": "On-call rotation guide", "version": "ops-oncall-v1", "status": "Adopted", "completeness": 80, "summary": "Rotation, handover checklist, and paging etiquette.", "detail": "Demo roster."}),
];
export const store = createGovernanceStore("ops_runbook", "ops_runbook", seed);
export const handlers = makeGovernanceHandlers(store, "ops runbook records");
