import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-005 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("model_select", 0, {"label": "Champion: bootstrap scorecard", "version": "pd-bootstrap-scorecard-v1.0.0", "status": "Adopted", "completeness": 85, "summary": "Points-based monotonic scorecard adopted as the Stage-1 baseline/champion (initialisation before trained models).", "detail": "Benchmark reference for challengers; deterministic and fully explainable."}),
  seedRecord("model_select", 1, {"label": "Challenger: WOE logistic", "version": "pd-woe-logit-v0.1", "status": "Needs review", "completeness": 30, "summary": "WOE-binned logistic regression challenger; requires the historical dataset and calibration before promotion.", "detail": "Candidate set also includes LightGBM/XGBoost/EBM per specification; none trained on synthetic-only data."}),
];
export const store = createGovernanceStore("model_select", "model_selection_baseline", seed);
export const handlers = makeGovernanceHandlers(store, "model selection records");
