import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 12-008 Data Quality Report (12-reports-exports) — governance records on the shared factory.
const seed = [
  seedRecord("data_quality_report", 0, {"label": "Data Quality Report specification", "version": "data-quality-report-v1", "status": "Adopted", "completeness": 85, "summary": "Data Quality Report baseline for the 12 reports exports batch. This batch contains implementation specifications for bank-ready exports, PDFs, memos, and evidence reports.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("data_quality_report", 1, {"label": "Data Quality Report extension", "version": "data-quality-report-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the data quality report baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("data_quality_report", "data_quality_report", seed);
export const handlers = makeGovernanceHandlers(store, "data quality report records");
