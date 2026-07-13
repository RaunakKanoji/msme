import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 17-011 Decision Audit Tables (17-database) — governance records on the shared factory.
const seed = [
  seedRecord("decision_audit_tables", 0, {"label": "Decision Audit Tables specification", "version": "decision-audit-tables-v1", "status": "Adopted", "completeness": 85, "summary": "Decision Audit Tables baseline for the 17 database batch. This batch contains implementation specifications for database schemas, migrations, seeds, and persistence rules.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("decision_audit_tables", 1, {"label": "Decision Audit Tables extension", "version": "decision-audit-tables-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the decision audit tables baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("decision_audit_tables", "decision_audit_tables", seed);
export const handlers = makeGovernanceHandlers(store, "decision audit tables records");
