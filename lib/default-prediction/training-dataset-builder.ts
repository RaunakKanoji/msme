import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-004 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("dataset_build", 0, {"label": "Synthetic bootstrap dataset", "version": "pd-train-synth-2026-07", "status": "Adopted", "completeness": 80, "summary": "100 synthetic MSMEs, point-in-time features at assessment date, time-based split 70/15/15 (train/validation/out-of-time).", "detail": "Checks passed: duplicate enterprises, label leakage, future information, class imbalance recorded. Synthetic only - not for production claims."}),
  seedRecord("dataset_build", 1, {"label": "Historical dataset build", "version": "pd-train-hist-v1", "status": "Draft", "completeness": 10, "summary": "Placeholder for the bank-history dataset build once outcome data is available.", "detail": "Blocked on historical outcome extraction from core systems."}),
];
export const store = createGovernanceStore("dataset_build", "training_dataset_builder", seed);
export const handlers = makeGovernanceHandlers(store, "training dataset builds");
