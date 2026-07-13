import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-007 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("prediction_api", 0, {"label": "Risk prediction contract", "version": "risk-predictions-v1", "status": "Adopted", "completeness": 88, "summary": "GET /api/v1/businesses/{id}/risk-predictions returns pd, band, segment, status, factors, and all governing versions.", "detail": "Every response carries trace_id, model version, definition version, and band config version; role-gated with masked identifiers."}),
  seedRecord("prediction_api", 1, {"label": "Batch scoring contract", "version": "risk-predictions-batch-v1", "status": "Draft", "completeness": 20, "summary": "Draft contract for portfolio-wide rescoring jobs.", "detail": "Depends on background-job infrastructure."}),
];
export const store = createGovernanceStore("prediction_api", "prediction_api", seed);
export const handlers = makeGovernanceHandlers(store, "prediction API contracts");
