import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-006 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("calibration", 0, {"label": "PD band configuration", "version": "pd-bands-v1", "status": "Adopted", "completeness": 90, "summary": "LOW <2.5%, LOW_MODERATE 2.5-6%, MODERATE 6-12%, HIGH 12-25%, VERY_HIGH 25%+. Independently configurable by the risk team.", "detail": "Probability anchor: 3.5% baseline odds with 30 points-to-double-the-odds (pd-engine pointsToPd)."}),
  seedRecord("calibration", 1, {"label": "Calibration review", "version": "calibration-check-2026-07", "status": "Needs review", "completeness": 45, "summary": "Bootstrap outputs are anchored, not outcome-calibrated; Brier score and calibration curves require observed outcomes.", "detail": "Scheduled with the first historical dataset build."}),
];
export const store = createGovernanceStore("calibration", "calibration_and_risk_bands", seed);
export const handlers = makeGovernanceHandlers(store, "calibration and risk bands");
