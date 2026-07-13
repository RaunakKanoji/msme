import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — application queues on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_queue", 0, {"label": "Review queue policy", "version": "queue-v1", "status": "Adopted", "completeness": 86, "summary": "Queue ordering: overdue first, then SLA due date, then PD descending; filters by stage, assignee, and risk band.", "detail": "SLA: 3 working days for manual review; breaches raise Medium alerts."}),
  seedRecord("an_queue", 1, {"label": "Auto-assignment rule", "version": "queue-assign-v1", "status": "Needs review", "completeness": 40, "summary": "Round-robin assignment weighted by open workload.", "detail": "Under review by operations."}),
];
export const store = createGovernanceStore("an_queue", "application_queue", seed);
export const handlers = makeGovernanceHandlers(store, "application queues");
