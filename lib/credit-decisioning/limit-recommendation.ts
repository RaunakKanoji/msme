import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — limit recommendations on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("limit_rec", 0, {"label": "Affordability limit formula", "version": "limit-rec-v1", "status": "Adopted", "completeness": 86, "summary": "Maximum annual debt service = cash available for debt service / target DSCR (1.5). Recommended limit derives from serviceable EMI capacity.", "detail": "All assumptions bank-configurable; recommendation only, not a sanction."}),
  seedRecord("limit_rec", 1, {"label": "Working-capital limit method", "version": "limit-rec-wc-v1", "status": "Needs review", "completeness": 45, "summary": "Turnover-based working-capital limit method (percentage of verified annual turnover).", "detail": "Awaiting policy-team ratification."}),
];
export const store = createGovernanceStore("limit_rec", "limit_recommendation", seed);
export const handlers = makeGovernanceHandlers(store, "limit recommendations");
