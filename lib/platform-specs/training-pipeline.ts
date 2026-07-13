import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 18-002 Training Pipeline (18-ml-platform) — governance records on the shared factory.
const seed = [
  seedRecord("training_pipeline", 0, {"label": "Training Pipeline specification", "version": "training-pipeline-v1", "status": "Adopted", "completeness": 85, "summary": "Training Pipeline baseline for the 18 ml platform batch. This batch contains implementation specifications for ML engineering lifecycle, registry, monitoring, and rollback.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("training_pipeline", 1, {"label": "Training Pipeline extension", "version": "training-pipeline-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the training pipeline baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("training_pipeline", "training_pipeline", seed);
export const handlers = makeGovernanceHandlers(store, "training pipeline records");
