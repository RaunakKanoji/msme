import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — exception handling policies on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("exception", 0, {"label": "Policy exception register", "version": "exception-v1", "status": "Adopted", "completeness": 83, "summary": "Any rule breach proceeding to recommendation requires a recorded exception with reason, approver authority, and expiry.", "detail": "Exceptions are never silent; each links the breached rule version and the approving officer."}),
  seedRecord("exception", 1, {"label": "Exception expiry sweep", "version": "exception-expiry-v1", "status": "Adopted", "completeness": 76, "summary": "Monthly job flags expired exceptions for re-review.", "detail": "Synthetic demonstration schedule."}),
];
export const store = createGovernanceStore("exception", "exception_handling", seed);
export const handlers = makeGovernanceHandlers(store, "exception handling policies");
