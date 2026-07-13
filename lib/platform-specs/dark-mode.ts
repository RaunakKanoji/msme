import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 14-011 Dark Mode (14-design-system-ui) — governance records on the shared factory.
const seed = [
  seedRecord("dark_mode", 0, {"label": "Dark Mode specification", "version": "dark-mode-v1", "status": "Adopted", "completeness": 85, "summary": "Dark Mode baseline for the 14 design system ui batch. This batch contains implementation specifications for visual design system, components, colors, and accessibility.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("dark_mode", 1, {"label": "Dark Mode extension", "version": "dark-mode-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the dark mode baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("dark_mode", "dark_mode", seed);
export const handlers = makeGovernanceHandlers(store, "dark mode records");
