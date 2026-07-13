import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — decision audit ledgers on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("dec_ledger", 0, {"label": "Immutable decision ledger", "version": "decision-ledger-v1", "status": "Adopted", "completeness": 90, "summary": "Every recommendation, review action, exception, and override appends an immutable entry: actor, timestamp, inputs hash, model and policy versions.", "detail": "Ledger entries are append-only; corrections append new entries rather than editing history."}),
  seedRecord("dec_ledger", 1, {"label": "Auditor read access", "version": "decision-ledger-access-v1", "status": "Adopted", "completeness": 85, "summary": "Internal audit receives read-only ledger access with masked customer identifiers.", "detail": "Access itself is logged."}),
];
export const store = createGovernanceStore("dec_ledger", "decision_audit_ledger", seed);
export const handlers = makeGovernanceHandlers(store, "decision audit ledgers");
