import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — credit committee memos on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("memo", 0, {"label": "Memo template", "version": "memo-v1", "status": "Adopted", "completeness": 80, "summary": "Structured memo: applicant summary, health score and PD with versions, policy results, exceptions, limit and pricing recommendation, collateral, and reviewer notes.", "detail": "Generated from live assessment data; never fabricates figures \u2014 missing data is shown as missing."}),
  seedRecord("memo", 1, {"label": "Committee decision record", "version": "memo-decision-v1", "status": "Adopted", "completeness": 78, "summary": "Committee outcomes recorded with member votes, conditions, and validity period.", "detail": "Linked into the decision audit ledger."}),
];
export const store = createGovernanceStore("memo", "credit_committee_memo", seed);
export const handlers = makeGovernanceHandlers(store, "credit committee memos");
