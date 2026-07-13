import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 15-001 Threat Model (15-security-compliance) — governance records on the shared factory.
const seed = [
  seedRecord("threat_model", 0, {"label": "Threat Model specification", "version": "threat-model-v1", "status": "Adopted", "completeness": 85, "summary": "Threat Model baseline for the 15 security compliance batch. This batch contains implementation specifications for security, privacy, regulatory, and compliance controls.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("threat_model", 1, {"label": "Threat Model extension", "version": "threat-model-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the threat model baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("threat_model", "threat_model", seed);
export const handlers = makeGovernanceHandlers(store, "threat model records");
