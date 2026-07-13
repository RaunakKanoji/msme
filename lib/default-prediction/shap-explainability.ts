import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-008 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("shap_explain", 0, {"label": "Scorecard attributions", "version": "points-attribution-v1", "status": "Adopted", "completeness": 86, "summary": "The bootstrap scorecard's factor points are exact additive attributions - each factor's contribution to PD is shown directly.", "detail": "Human-readable reason codes (e.g. DSCR_BELOW_1) map to customer-safe copy; raw feature names are never shown to borrowers."}),
  seedRecord("shap_explain", 1, {"label": "SHAP for tree models", "version": "shap-tree-v1", "status": "Draft", "completeness": 15, "summary": "SHAP value generation applies once a trained tree challenger is promoted.", "detail": "Blocked on trained model; grouping template prepared."}),
];
export const store = createGovernanceStore("shap_explain", "shap_explainability", seed);
export const handlers = makeGovernanceHandlers(store, "explainability methods");
