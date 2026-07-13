import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — health card panels on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_health", 0, {"label": "Health panel layout", "version": "health-panel-v1", "status": "Adopted", "completeness": 86, "summary": "Score, band, per-pillar breakdown with weights, strengths, and risks embedded in the analyst view.", "detail": "Reads the same health engine output as the customer card \u2014 one scoring path."}),
  seedRecord("an_health", 1, {"label": "Score-history sparkline", "version": "health-panel-history-v1", "status": "Needs review", "completeness": 35, "summary": "Deterministic demo history pending real assessment persistence.", "detail": "Requires assessment store."}),
];
export const store = createGovernanceStore("an_health", "health_card_panel", seed);
export const handlers = makeGovernanceHandlers(store, "health card panels");
