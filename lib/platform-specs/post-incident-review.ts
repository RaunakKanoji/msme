import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 21-010 Post Incident Review (21-operations-support) — governance records on the shared factory.
const seed = [
  seedRecord("post_incident_review", 0, {"label": "Post-incident review template", "version": "pir-v1", "status": "Adopted", "completeness": 88, "summary": "Blameless PIR: timeline, impact, root cause, fallback behaviour, action items with owners, and runbook updates.", "detail": "Reviews link back to the runbook versions in force during the incident."}),
  seedRecord("post_incident_review", 1, {"label": "PIR: connector outage 2026-06", "version": "pir-2026-06-demo", "status": "Adopted", "completeness": 82, "summary": "Demo review of a simulated AA outage: fallback engaged in 4 minutes, zero silent-data incidents, two runbook improvements adopted.", "detail": "Demonstration record."}),
];
export const store = createGovernanceStore("post_incident_review", "post_incident_review", seed);
export const handlers = makeGovernanceHandlers(store, "post incident review records");
