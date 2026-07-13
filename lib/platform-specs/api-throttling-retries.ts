import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 13-004 API Throttling Retries (13-sandbox-integrations) — governance records on the shared factory.
const seed = [
  seedRecord("api_throttling_retries", 0, {"label": "API Throttling Retries specification", "version": "api-throttling-retries-v1", "status": "Adopted", "completeness": 85, "summary": "API Throttling Retries baseline for the 13 sandbox integrations batch. This batch contains implementation specifications for IDBI sandbox and synthetic-data integration readiness.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("api_throttling_retries", 1, {"label": "API Throttling Retries extension", "version": "api-throttling-retries-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the api throttling retries baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("api_throttling_retries", "api_throttling_retries", seed);
export const handlers = makeGovernanceHandlers(store, "api throttling retries records");
