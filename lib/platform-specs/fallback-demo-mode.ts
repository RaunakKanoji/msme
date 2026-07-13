import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 13-007 Fallback Demo Mode (13-sandbox-integrations) — governance records on the shared factory.
const seed = [
  seedRecord("fallback_demo_mode", 0, {"label": "Fallback Demo Mode specification", "version": "fallback-demo-mode-v1", "status": "Adopted", "completeness": 85, "summary": "Fallback Demo Mode baseline for the 13 sandbox integrations batch. This batch contains implementation specifications for IDBI sandbox and synthetic-data integration readiness.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("fallback_demo_mode", 1, {"label": "Fallback Demo Mode extension", "version": "fallback-demo-mode-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the fallback demo mode baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("fallback_demo_mode", "fallback_demo_mode", seed);
export const handlers = makeGovernanceHandlers(store, "fallback demo mode records");
