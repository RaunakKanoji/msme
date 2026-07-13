import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — analyst tasks on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_task", 0, {"label": "Task: verify GST mismatch", "version": "task-2026-07-14-a", "status": "Needs review", "completeness": 60, "summary": "Reconcile GSTR-3B turnover against bank credits for APP-2026-001003 before recommendation.", "detail": "Due in 2 working days; assigned to credit analyst."}),
  seedRecord("an_task", 1, {"label": "Task: collect guarantor net worth", "version": "task-2026-07-15-b", "status": "Draft", "completeness": 30, "summary": "Obtain promoter net-worth statement for facilities above 10L.", "detail": "Awaiting borrower response."}),
];
export const store = createGovernanceStore("an_task", "task_assignment", seed);
export const handlers = makeGovernanceHandlers(store, "analyst tasks");
