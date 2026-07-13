import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-010 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("model_monitor", 0, {"label": "Monitoring metric set", "version": "pd-monitoring-v1", "status": "Adopted", "completeness": 82, "summary": "PSI on inputs, prediction drift, band distribution stability, provisional rate, and override rate; monthly cadence.", "detail": "Thresholds: PSI > 0.2 triggers investigation; band shift > 10pp triggers model-risk review. Synthetic runs only."}),
  seedRecord("model_monitor", 1, {"label": "Drift baseline snapshot", "version": "pd-monitoring-baseline-2026-07", "status": "Adopted", "completeness": 78, "summary": "Baseline input distributions captured from the synthetic portfolio for future drift comparison.", "detail": "Recomputed on retraining or dataset change."}),
];
export const store = createGovernanceStore("model_monitor", "model_monitoring", seed);
export const handlers = makeGovernanceHandlers(store, "model monitoring configs");
