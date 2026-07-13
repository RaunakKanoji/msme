import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — eligibility policy rules on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("elig_rule", 0, {"label": "Baseline eligibility rule set", "version": "credit-policy-v1", "status": "Adopted", "completeness": 90, "summary": "Minimum vintage 2 years, PD below 25%, health score 35+, DSCR proxy 1.0+, no prohibited sectors; thin-file routes to manual review.", "detail": "Policy rules live outside application code as versioned configuration; the decision engine evaluates them per application."}),
  seedRecord("elig_rule", 1, {"label": "Seasonal-business exception rules", "version": "credit-policy-seasonal-v1-draft", "status": "Draft", "completeness": 30, "summary": "Draft relaxation of cash-flow stability thresholds for verified seasonal businesses.", "detail": "Pending risk-team approval."}),
];
export const store = createGovernanceStore("elig_rule", "eligibility_policy_rules", seed);
export const handlers = makeGovernanceHandlers(store, "eligibility policy rules");
