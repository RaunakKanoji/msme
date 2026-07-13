import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 14-003 Typography (14-design-system-ui) — governance records on the shared factory.
const seed = [
  seedRecord("typography", 0, {"label": "Typography specification", "version": "typography-v1", "status": "Adopted", "completeness": 85, "summary": "Typography baseline for the 14 design system ui batch. This batch contains implementation specifications for visual design system, components, colors, and accessibility.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("typography", 1, {"label": "Typography extension", "version": "typography-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the typography baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("typography", "typography", seed);
export const handlers = makeGovernanceHandlers(store, "typography records");
