import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 10-005 Invoice Collections Actions (10-msme-owner-experience) — governance records on the shared factory.
const seed = [
  seedRecord("invoice_collections_acti", 0, {"label": "Collections action pack", "version": "collections-v1", "status": "Adopted", "completeness": 85, "summary": "Receivable-focused actions: invoice follow-up cadence, top-buyer concentration mitigation, and digital-collection nudges.", "detail": "Triggered when customer-concentration or receivable signals appear in the assessment."}),
  seedRecord("invoice_collections_acti", 1, {"label": "Collections reminder templates", "version": "collections-reminders-v1", "status": "Adopted", "completeness": 80, "summary": "Polite, firm, and final reminder templates in supportive tone.", "detail": "Owner-editable before sending; sending lands with notifications."}),
];
export const store = createGovernanceStore("invoice_collections_acti", "invoice_collections_actions", seed);
export const handlers = makeGovernanceHandlers(store, "invoice collections actions records");
