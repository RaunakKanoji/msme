import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 21-007 Prediction Failure Runbook (21-operations-support) — governance records on the shared factory.
const seed = [
  seedRecord("prediction_failure_runbo", 0, {"label": "Prediction failure runbook", "version": "prediction-runbook-v1", "status": "Adopted", "completeness": 86, "summary": "Scoring failure steps: validate inputs, check feature pipeline versions, rerun deterministically, fall back to last final assessment with stale labelling, open model-risk ticket.", "detail": "Provisional/stale labelling is mandatory during degraded operation."}),
  seedRecord("prediction_failure_runbo", 1, {"label": "Rollback drill record", "version": "prediction-rollback-drill-v1", "status": "Adopted", "completeness": 75, "summary": "Quarterly rollback drill against the version registry.", "detail": "Demo drill log."}),
];
export const store = createGovernanceStore("prediction_failure_runbo", "prediction_failure_runbook", seed);
export const handlers = makeGovernanceHandlers(store, "prediction failure runbook records");
