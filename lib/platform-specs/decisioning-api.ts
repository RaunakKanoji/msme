import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 16-009 Decisioning API (16-apis-backend) — governance records on the shared factory.
const seed = [
  seedRecord("decisioning_api", 0, {"label": "Decisioning API specification", "version": "decisioning-api-v1", "status": "Adopted", "completeness": 85, "summary": "Decisioning API baseline for the 16 apis backend batch. This batch contains implementation specifications for backend API contracts and service boundaries.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("decisioning_api", 1, {"label": "Decisioning API extension", "version": "decisioning-api-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the decisioning api baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("decisioning_api", "decisioning_api", seed);
export const handlers = makeGovernanceHandlers(store, "decisioning api records");
