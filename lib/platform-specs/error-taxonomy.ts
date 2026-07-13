import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 16-014 Error Taxonomy (16-apis-backend) — governance records on the shared factory.
const seed = [
  seedRecord("error_taxonomy", 0, {"label": "Error Taxonomy specification", "version": "error-taxonomy-v1", "status": "Adopted", "completeness": 85, "summary": "Error Taxonomy baseline for the 16 apis backend batch. This batch contains implementation specifications for backend API contracts and service boundaries.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("error_taxonomy", 1, {"label": "Error Taxonomy extension", "version": "error-taxonomy-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the error taxonomy baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("error_taxonomy", "error_taxonomy", seed);
export const handlers = makeGovernanceHandlers(store, "error taxonomy records");
