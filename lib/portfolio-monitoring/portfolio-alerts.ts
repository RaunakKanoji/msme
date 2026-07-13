import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — portfolio alert policies on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_alerts", 0, {"label": "Portfolio alert routing", "version": "pf-alerts-v1", "status": "Adopted", "completeness": 84, "summary": "Severity-based routing: Critical to risk officer same-day, High to branch manager, Medium to RM weekly digest.", "detail": "Live alert stream feeds /bank/alerts and the watchlist."}),
  seedRecord("pf_alerts", 1, {"label": "Alert suppression rule", "version": "pf-alerts-suppress-v1", "status": "Adopted", "completeness": 78, "summary": "Duplicate alerts within 7 days suppressed with reference to the original.", "detail": "Suppressions logged."}),
];
export const store = createGovernanceStore("pf_alerts", "portfolio_alerts", seed);
export const handlers = makeGovernanceHandlers(store, "portfolio alert policies");
