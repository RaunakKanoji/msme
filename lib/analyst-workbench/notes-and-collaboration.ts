import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — analyst notes on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_notes", 0, {"label": "Assessment note: Saraswati Precision", "version": "note-2026-07-13-a", "status": "Adopted", "completeness": 90, "summary": "Cash-flow stability strong; customer concentration flagged \u2014 requested top-buyer contract summary before sanction.", "detail": "Notes are immutable once submitted; edits append revisions with actor and timestamp."}),
  seedRecord("an_notes", 1, {"label": "Review note: thin-file provisional", "version": "note-2026-07-12-b", "status": "Adopted", "completeness": 85, "summary": "Provisional assessment \u2014 asked RM to obtain 6 more months of statements via AA refresh.", "detail": "Linked to the application timeline."}),
];
export const store = createGovernanceStore("an_notes", "notes_and_collaboration", seed);
export const handlers = makeGovernanceHandlers(store, "analyst notes");
