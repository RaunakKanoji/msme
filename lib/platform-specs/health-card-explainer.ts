import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 10-002 Health Card Explainer (10-msme-owner-experience) — governance records on the shared factory.
const seed = [
  seedRecord("health_card_explainer", 0, {"label": "Health card explainer copy", "version": "health-explainer-v1", "status": "Adopted", "completeness": 92, "summary": "Each pillar explained in plain language: what it measures, why it matters, and what a business owner can do about it.", "detail": "No raw feature names or model internals; approved explanations only."}),
  seedRecord("health_card_explainer", 1, {"label": "Vernacular explainer set", "version": "health-explainer-hi-v1", "status": "Draft", "completeness": 20, "summary": "Draft Hindi explainer copy.", "detail": "Pending translation review."}),
];
export const store = createGovernanceStore("health_card_explainer", "health_card_explainer", seed);
export const handlers = makeGovernanceHandlers(store, "health card explainer records");
