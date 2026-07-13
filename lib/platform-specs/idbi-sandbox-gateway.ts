import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 13-001 Idbi Sandbox Gateway (13-sandbox-integrations) — governance records on the shared factory.
const seed = [
  seedRecord("idbi_sandbox_gateway", 0, {"label": "Idbi Sandbox Gateway specification", "version": "idbi-sandbox-gateway-v1", "status": "Adopted", "completeness": 85, "summary": "Idbi Sandbox Gateway baseline for the 13 sandbox integrations batch. This batch contains implementation specifications for IDBI sandbox and synthetic-data integration readiness.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("idbi_sandbox_gateway", 1, {"label": "Idbi Sandbox Gateway extension", "version": "idbi-sandbox-gateway-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the idbi sandbox gateway baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("idbi_sandbox_gateway", "idbi_sandbox_gateway", seed);
export const handlers = makeGovernanceHandlers(store, "idbi sandbox gateway records");
