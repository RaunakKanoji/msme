import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 11-005 Score Configuration (11-admin-governance) — governance records on the shared factory.
const seed = [
  seedRecord("score_configuration", 0, {"label": "Score Configuration specification", "version": "score-configuration-v1", "status": "Adopted", "completeness": 85, "summary": "Score Configuration baseline for the 11 admin governance batch. This batch contains implementation specifications for administration, configuration, governance, and auditability.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("score_configuration", 1, {"label": "Score Configuration extension", "version": "score-configuration-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the score configuration baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("score_configuration", "score_configuration", seed);
export const handlers = makeGovernanceHandlers(store, "score configuration records");
