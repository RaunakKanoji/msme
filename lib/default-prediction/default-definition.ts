import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-001 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("default_definition", 0, {"label": "Default event definition", "version": "default-90dpd-v1", "status": "Adopted", "completeness": 92, "summary": "A default event is 90+ days past due, NPA classification, write-off, distress restructuring, or confirmed closure with unpaid obligations.", "detail": "Version referenced by every PD assessment (pd-engine definitionVersion). Observation date, performance window, and outcome source are recorded per label."}),
  seedRecord("default_definition", 1, {"label": "Expanded default definition", "version": "default-90dpd-v2-draft", "status": "Draft", "completeness": 40, "summary": "Draft v2 adds material settlement caused by financial difficulty as a qualifying event.", "detail": "Held in draft pending model-risk approval; not referenced by any live assessment."}),
];
export const store = createGovernanceStore("default_definition", "default_definition", seed);
export const handlers = makeGovernanceHandlers(store, "default definitions");
