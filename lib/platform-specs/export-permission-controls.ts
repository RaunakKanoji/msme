import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 12-009 Export Permission Controls (12-reports-exports) — governance records on the shared factory.
const seed = [
  seedRecord("export_permission_contro", 0, {"label": "Export Permission Controls specification", "version": "export-permission-controls-v1", "status": "Adopted", "completeness": 85, "summary": "Export Permission Controls baseline for the 12 reports exports batch. This batch contains implementation specifications for bank-ready exports, PDFs, memos, and evidence reports.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("export_permission_contro", 1, {"label": "Export Permission Controls extension", "version": "export-permission-controls-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the export permission controls baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("export_permission_contro", "export_permission_controls", seed);
export const handlers = makeGovernanceHandlers(store, "export permission controls records");
