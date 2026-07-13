import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 17-012 Report Tables (17-database) — governance records on the shared factory.
const seed = [
  seedRecord("report_tables", 0, {"label": "Report Tables specification", "version": "report-tables-v1", "status": "Adopted", "completeness": 85, "summary": "Report Tables baseline for the 17 database batch. This batch contains implementation specifications for database schemas, migrations, seeds, and persistence rules.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("report_tables", 1, {"label": "Report Tables extension", "version": "report-tables-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the report tables baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("report_tables", "report_tables", seed);
export const handlers = makeGovernanceHandlers(store, "report tables records");
