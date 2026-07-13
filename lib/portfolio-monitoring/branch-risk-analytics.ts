import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — branch risk analytics on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_branch", 0, {"label": "Branch analytics config", "version": "branch-risk-v1", "status": "Adopted", "completeness": 85, "summary": "Average score, portfolio PD, and alert counts by branch, rendered live.", "detail": "Supports branch-manager drill-down via the registry filters."}),
  seedRecord("pf_branch", 1, {"label": "RM performance view", "version": "branch-rm-v1", "status": "Draft", "completeness": 25, "summary": "Draft relationship-manager portfolio quality view.", "detail": "Pending assignment history analytics."}),
];
export const store = createGovernanceStore("pf_branch", "branch_risk_analytics", seed);
export const handlers = makeGovernanceHandlers(store, "branch risk analytics");
