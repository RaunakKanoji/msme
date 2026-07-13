import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — watchlist policies on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_watch", 0, {"label": "Watchlist entry criteria", "version": "watchlist-v1", "status": "Adopted", "completeness": 86, "summary": "Auto-entry: PD 12%+, health below 45, or Critical band; exit requires two consecutive improved assessments and reviewer sign-off.", "detail": "Entries and exits are audit-logged with reviewer identity."}),
  seedRecord("pf_watch", 1, {"label": "Watchlist review cadence", "version": "watchlist-cadence-v1", "status": "Adopted", "completeness": 80, "summary": "Monthly review for High, weekly for Critical entries.", "detail": "SLA breaches raise alerts."}),
];
export const store = createGovernanceStore("pf_watch", "watchlist_management", seed);
export const handlers = makeGovernanceHandlers(store, "watchlist policies");
