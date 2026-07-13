import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — exposure monitoring rules on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_exposure", 0, {"label": "Exposure aggregation rule", "version": "exposure-v1", "status": "Adopted", "completeness": 82, "summary": "Portfolio exposure = sum of outstanding liabilities; single-name concentration flagged above 5% of portfolio.", "detail": "Aggregated live from snapshots; masked identifiers."}),
  seedRecord("pf_exposure", 1, {"label": "Sector exposure caps", "version": "exposure-caps-v1", "status": "Needs review", "completeness": 45, "summary": "Proposed caps per industry pending risk-committee ratification.", "detail": "Draft thresholds recorded."}),
];
export const store = createGovernanceStore("pf_exposure", "exposure_monitoring", seed);
export const handlers = makeGovernanceHandlers(store, "exposure monitoring rules");
