import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-012 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("synth_disclaimer", 0, {"label": "Customer-facing disclaimer", "version": "disclaimer-customer-v1", "status": "Adopted", "completeness": 95, "summary": "This risk estimate is generated from demonstration data for product evaluation. It is not a credit decision, offer, or bureau score.", "detail": "Shown wherever demo-derived predictions appear in the customer app."}),
  seedRecord("synth_disclaimer", 1, {"label": "Bank-facing disclaimer", "version": "disclaimer-bank-v1", "status": "Adopted", "completeness": 95, "summary": "Synthetic-only outputs must not be used for production credit decisions or model validation claims.", "detail": "Shown in the bank portal and embedded in prediction API responses via isDemo flags."}),
];
export const store = createGovernanceStore("synth_disclaimer", "synthetic_data_disclaimer", seed);
export const handlers = makeGovernanceHandlers(store, "synthetic data disclaimers");
