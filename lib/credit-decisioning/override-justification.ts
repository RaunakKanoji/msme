import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — override justifications on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("override", 0, {"label": "Override policy", "version": "override-v1", "status": "Adopted", "completeness": 88, "summary": "Overriding a recommendation requires reason text, supporting document reference, user authority, prior and new decision, and maker-checker approval where applicable.", "detail": "Silent overrides are impossible: the ledger stores every override immutably with actor and timestamp."}),
  seedRecord("override", 1, {"label": "Override authority grid", "version": "override-authority-v1", "status": "Adopted", "completeness": 80, "summary": "Branch manager to 10L, regional credit to 50L, central committee above.", "detail": "Authority checks precede acceptance of an override."}),
];
export const store = createGovernanceStore("override", "override_justification", seed);
export const handlers = makeGovernanceHandlers(store, "override justifications");
