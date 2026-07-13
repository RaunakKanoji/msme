import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "./governance-store.ts";
export { GOVERNANCE_STATUSES };
// 06-003 — governance records served through the shared factory (see governance-store.ts).
const seed = [
  seedRecord("feature_eng", 0, {"label": "PD feature set", "version": "aa-risk-features-v1", "status": "Adopted", "completeness": 88, "summary": "Versioned features: net cash-flow margin, DSCR proxy, liquidity buffer months, leverage ratio, data-history months, bureau availability flag.", "detail": "Monotonic constraints: worse margin/DSCR/liquidity/leverage may only raise PD. Missing bureau history is neutral, never negative."}),
  seedRecord("feature_eng", 1, {"label": "Extended feature set", "version": "aa-risk-features-v2-draft", "status": "Draft", "completeness": 35, "summary": "Draft adds GST filing regularity, customer concentration, and UPI volatility features.", "detail": "Requires canonical GST/UPI per-MSME datasets before adoption."}),
];
export const store = createGovernanceStore("feature_eng", "model_feature_engineering", seed);
export const handlers = makeGovernanceHandlers(store, "model features");
