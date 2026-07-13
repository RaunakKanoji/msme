import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — PD risk panels on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_pd", 0, {"label": "PD panel layout", "version": "pd-panel-v1", "status": "Adopted", "completeness": 86, "summary": "PD percentage, band, provisional status, additive factor attributions, and governing versions.", "detail": "Same pd-engine output as the risk surface; separate from the health score."}),
  seedRecord("an_pd", 1, {"label": "Peer-percentile comparison", "version": "pd-panel-peer-v1", "status": "Draft", "completeness": 25, "summary": "Anonymized percentile comparison against segment peers.", "detail": "Blocked on percentile service."}),
];
export const store = createGovernanceStore("an_pd", "pd_risk_panel", seed);
export const handlers = makeGovernanceHandlers(store, "PD risk panels");
