import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 18-005 Experiment Tracking (18-ml-platform) — governance records on the shared factory.
const seed = [
  seedRecord("experiment_tracking", 0, {"label": "Experiment Tracking specification", "version": "experiment-tracking-v1", "status": "Adopted", "completeness": 85, "summary": "Experiment Tracking baseline for the 18 ml platform batch. This batch contains implementation specifications for ML engineering lifecycle, registry, monitoring, and rollback.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("experiment_tracking", 1, {"label": "Experiment Tracking extension", "version": "experiment-tracking-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the experiment tracking baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("experiment_tracking", "experiment_tracking", seed);
export const handlers = makeGovernanceHandlers(store, "experiment tracking records");
