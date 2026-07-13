import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 14-005 Sidebar Navigation Design (14-design-system-ui) — governance records on the shared factory.
const seed = [
  seedRecord("sidebar_navigation_desig", 0, {"label": "Sidebar Navigation Design specification", "version": "sidebar-navigation-design-v1", "status": "Adopted", "completeness": 85, "summary": "Sidebar Navigation Design baseline for the 14 design system ui batch. This batch contains implementation specifications for visual design system, components, colors, and accessibility.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("sidebar_navigation_desig", 1, {"label": "Sidebar Navigation Design extension", "version": "sidebar-navigation-design-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the sidebar navigation design baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("sidebar_navigation_desig", "sidebar_navigation_design", seed);
export const handlers = makeGovernanceHandlers(store, "sidebar navigation design records");
