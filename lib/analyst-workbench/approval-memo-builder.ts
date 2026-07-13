import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — approval memo builders on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_memo", 0, {"label": "Memo builder template", "version": "memo-builder-v1", "status": "Adopted", "completeness": 84, "summary": "Assembles applicant summary, scores with versions, policy results, exceptions, recommendation, and reviewer notes into a structured memo.", "detail": "Generated from live engine output; missing data is shown as missing, never fabricated."}),
  seedRecord("an_memo", 1, {"label": "Committee annexure pack", "version": "memo-annexure-v1", "status": "Draft", "completeness": 25, "summary": "Draft annexure set: evidence register extract and monitoring history.", "detail": "Pending export service."}),
];
export const store = createGovernanceStore("an_memo", "approval_memo_builder", seed);
export const handlers = makeGovernanceHandlers(store, "approval memo builders");
