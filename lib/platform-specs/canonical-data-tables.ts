import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 17-007 Canonical Data Tables (17-database) — governance records on the shared factory.
const seed = [
  seedRecord("canonical_data_tables", 0, {"label": "Canonical Data Tables specification", "version": "canonical-data-tables-v1", "status": "Adopted", "completeness": 85, "summary": "Canonical Data Tables baseline for the 17 database batch. This batch contains implementation specifications for database schemas, migrations, seeds, and persistence rules.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("canonical_data_tables", 1, {"label": "Canonical Data Tables extension", "version": "canonical-data-tables-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the canonical data tables baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("canonical_data_tables", "canonical_data_tables", seed);
export const handlers = makeGovernanceHandlers(store, "canonical data tables records");
