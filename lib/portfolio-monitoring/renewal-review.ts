import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — renewal reviews on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_renewal", 0, {"label": "Renewal review policy", "version": "renewal-v1", "status": "Adopted", "completeness": 81, "summary": "Facilities due within 90 days enter renewal review with refreshed assessment required before extension.", "detail": "Renewal decisions follow the same human-authority rules as new credit."}),
  seedRecord("pf_renewal", 1, {"label": "Early renewal fast-track", "version": "renewal-fasttrack-v1", "status": "Draft", "completeness": 30, "summary": "Draft fast-track for Strong band with clean conduct.", "detail": "Pending conduct features."}),
];
export const store = createGovernanceStore("pf_renewal", "renewal_review", seed);
export const handlers = makeGovernanceHandlers(store, "renewal reviews");
