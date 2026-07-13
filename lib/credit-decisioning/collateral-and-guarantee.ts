import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 07-credit-decisioning — collateral and guarantee policies on the shared governance factory. Policy lives as versioned configuration,
// never hardcoded in application code; the model never bypasses policy; approval authority is always human.
const seed = [
  seedRecord("collateral", 0, {"label": "Collateral policy", "version": "collateral-v1", "status": "Adopted", "completeness": 84, "summary": "Unsecured up to 10L within CGTMSE coverage; 10-50L requires guarantee cover; above 50L requires tangible security at 1.25x.", "detail": "Guarantee schemes recorded per facility; valuations must be current within 12 months."}),
  seedRecord("collateral", 1, {"label": "Guarantor assessment rule", "version": "guarantor-v1", "status": "Adopted", "completeness": 78, "summary": "Personal guarantees require promoter bureau review and net-worth statement.", "detail": "Related-party guarantees flagged for review."}),
];
export const store = createGovernanceStore("collateral", "collateral_and_guarantee", seed);
export const handlers = makeGovernanceHandlers(store, "collateral and guarantee policies");
