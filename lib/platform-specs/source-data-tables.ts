import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 17-006 Source Data Tables (17-database) — governance records on the shared factory.
const seed = [
  seedRecord("source_data_tables", 0, {"label": "Source Data Tables specification", "version": "source-data-tables-v1", "status": "Adopted", "completeness": 85, "summary": "Source Data Tables baseline for the 17 database batch. This batch contains implementation specifications for database schemas, migrations, seeds, and persistence rules.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("source_data_tables", 1, {"label": "Source Data Tables extension", "version": "source-data-tables-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the source data tables baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("source_data_tables", "source_data_tables", seed);
export const handlers = makeGovernanceHandlers(store, "source data tables records");
