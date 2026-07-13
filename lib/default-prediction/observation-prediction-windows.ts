import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-002 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("obs_window", 0, {"label": "Standard window set", "version": "windows-v1", "status": "Adopted", "completeness": 90, "summary": "Bank transactions 6-24 months, GST 12-24 months, UPI 6-24 months, EPFO 6-24 months, statements up to 5 years; performance window 12 months.", "detail": "Point-in-time rule: no information generated after the assessment date may enter features (leakage guard)."}),
  seedRecord("obs_window", 1, {"label": "Thin-file window set", "version": "windows-thin-v1", "status": "Needs review", "completeness": 55, "summary": "Reduced 3-6 month observation window for thin-file segment with provisional output gating.", "detail": "Under review: shorter windows widen uncertainty; provisional status is mandatory."}),
];
export const store = createGovernanceStore("obs_window", "observation_prediction_windows", seed);
export const handlers = makeGovernanceHandlers(store, "observation windows");
