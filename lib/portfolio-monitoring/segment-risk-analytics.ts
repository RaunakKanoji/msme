import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — segment risk analytics on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_segment", 0, {"label": "Segment analytics config", "version": "segment-risk-v1", "status": "Adopted", "completeness": 85, "summary": "Average score and PD by customer segment (NTC/NTB/ETB/thin-file) with counts, rendered live.", "detail": "Aggregated from registry records; anonymized percentiles only."}),
  seedRecord("pf_segment", 1, {"label": "Industry concentration view", "version": "segment-industry-v1", "status": "Adopted", "completeness": 80, "summary": "Exposure share by industry with concentration flags above 25%.", "detail": "Live from registry industries."}),
];
export const store = createGovernanceStore("pf_segment", "segment_risk_analytics", seed);
export const handlers = makeGovernanceHandlers(store, "segment risk analytics");
