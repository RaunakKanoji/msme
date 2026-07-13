import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — analyst dashboards on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_dash", 0, {"label": "Workbench dashboard config", "version": "analyst-dash-v1", "status": "Adopted", "completeness": 88, "summary": "Queue summary tiles (assigned, due today, overdue, awaiting information), portfolio risk snapshot, and recent activity feed.", "detail": "Rendered live at /app/analyst from the shared application and registry stores."}),
  seedRecord("an_dash", 1, {"label": "Team-lead dashboard view", "version": "analyst-dash-lead-v1", "status": "Draft", "completeness": 30, "summary": "Draft aggregated view across analysts with workload balancing.", "detail": "Pending team-structure data."}),
];
export const store = createGovernanceStore("an_dash", "analyst_dashboard", seed);
export const handlers = makeGovernanceHandlers(store, "analyst dashboards");
