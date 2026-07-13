import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 10-004 Improvement Plan (10-msme-owner-experience) — governance records on the shared factory.
const seed = [
  seedRecord("improvement_plan", 0, {"label": "Improvement plan generator", "version": "improve-plan-v1", "status": "Adopted", "completeness": 88, "summary": "Turns the weakest pillars and top risks into a prioritized, plain-language action plan with expected impact.", "detail": "Generated live from the health engine's risks and recommendations; never generic advice."}),
  seedRecord("improvement_plan", 1, {"label": "Plan progress tracking", "version": "improve-plan-progress-v1", "status": "Draft", "completeness": 20, "summary": "Draft completion tracking against plan items.", "detail": "Pending persistence."}),
];
export const store = createGovernanceStore("improvement_plan", "improvement_plan", seed);
export const handlers = makeGovernanceHandlers(store, "improvement plan records");
