import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — early warning indicators on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_ewi", 0, {"label": "EWI catalogue", "version": "ewi-v1", "status": "Adopted", "completeness": 84, "summary": "Score deterioration, PD increase, elevated risk indicators, and thin-file flags mapped to severity levels.", "detail": "Derived from the live alert stream; thresholds configurable."}),
  seedRecord("pf_ewi", 1, {"label": "Cash-flow EWI extension", "version": "ewi-cashflow-v1", "status": "Draft", "completeness": 30, "summary": "Draft indicators: inflow drop 25%+, negative cash-flow months, low-balance days.", "detail": "Requires monthly rescoring history."}),
];
export const store = createGovernanceStore("pf_ewi", "early_warning_indicators", seed);
export const handlers = makeGovernanceHandlers(store, "early warning indicators");
