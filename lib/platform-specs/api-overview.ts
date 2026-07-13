import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 16-001 API Overview (16-apis-backend) — governance records on the shared factory.
const seed = [
  seedRecord("api_overview", 0, {"label": "API Overview specification", "version": "api-overview-v1", "status": "Adopted", "completeness": 85, "summary": "API Overview baseline for the 16 apis backend batch. This batch contains implementation specifications for backend API contracts and service boundaries.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("api_overview", 1, {"label": "API Overview extension", "version": "api-overview-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the api overview baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("api_overview", "api_overview", seed);
export const handlers = makeGovernanceHandlers(store, "api overview records");
