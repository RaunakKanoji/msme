import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 10-003 Risk Outlook Explainer (10-msme-owner-experience) — governance records on the shared factory.
const seed = [
  seedRecord("risk_outlook_explainer", 0, {"label": "Risk outlook copy", "version": "risk-outlook-v1", "status": "Adopted", "completeness": 90, "summary": "The 12-month default estimate explained as an outlook: what it is, what it is not (not a bureau score or decision), and what moves it.", "detail": "Shown beside the PD figure with provisional labelling when history is limited."}),
  seedRecord("risk_outlook_explainer", 1, {"label": "Outlook trend narrative", "version": "risk-outlook-trend-v1", "status": "Draft", "completeness": 25, "summary": "Draft narrative for outlook changes between assessments.", "detail": "Needs assessment history."}),
];
export const store = createGovernanceStore("risk_outlook_explainer", "risk_outlook_explainer", seed);
export const handlers = makeGovernanceHandlers(store, "risk outlook explainer records");
