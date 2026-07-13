import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — borrower summary panels on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_borrower", 0, {"label": "Borrower summary layout", "version": "borrower-panel-v1", "status": "Adopted", "completeness": 84, "summary": "Identity strip (masked PAN/GSTIN/Udyam), segment, vintage, branch/RM, connected sources, and onboarding status in one panel.", "detail": "All identifiers masked; raw values never rendered in the workbench."}),
  seedRecord("an_borrower", 1, {"label": "Related-party spotlight", "version": "borrower-related-v1", "status": "Draft", "completeness": 20, "summary": "Draft panel for promoter and related-enterprise exposure.", "detail": "Blocked on promoter graph data."}),
];
export const store = createGovernanceStore("an_borrower", "borrower_summary_panel", seed);
export const handlers = makeGovernanceHandlers(store, "borrower summary panels");
