import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 15-003 RBI Digital Lending Controls (15-security-compliance) — governance records on the shared factory.
const seed = [
  seedRecord("rbi_digital_lending_cont", 0, {"label": "RBI Digital Lending Controls specification", "version": "rbi-digital-lending-controls-v1", "status": "Adopted", "completeness": 85, "summary": "RBI Digital Lending Controls baseline for the 15 security compliance batch. This batch contains implementation specifications for security, privacy, regulatory, and compliance controls.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("rbi_digital_lending_cont", 1, {"label": "RBI Digital Lending Controls extension", "version": "rbi-digital-lending-controls-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the rbi digital lending controls baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("rbi_digital_lending_cont", "rbi_digital_lending_controls", seed);
export const handlers = makeGovernanceHandlers(store, "rbi digital lending controls records");
