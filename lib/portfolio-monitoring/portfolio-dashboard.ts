import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — portfolio dashboards on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_dash", 0, {"label": "Portfolio dashboard config", "version": "pf-dash-v1", "status": "Adopted", "completeness": 88, "summary": "Portfolio KPIs (count, average score, portfolio PD, exposure), band distribution, and segment/branch analytics rendered live at /app/portfolio.", "detail": "Live from the shared registry; demonstration data."}),
  seedRecord("pf_dash", 1, {"label": "Executive summary view", "version": "pf-dash-exec-v1", "status": "Draft", "completeness": 25, "summary": "Draft board-level monthly summary.", "detail": "Pending reports module."}),
];
export const store = createGovernanceStore("pf_dash", "portfolio_dashboard", seed);
export const handlers = makeGovernanceHandlers(store, "portfolio dashboards");
