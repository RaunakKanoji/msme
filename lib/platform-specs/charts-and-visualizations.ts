import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 14-008 Charts And Visualizations (14-design-system-ui) — governance records on the shared factory.
const seed = [
  seedRecord("charts_and_visualization", 0, {"label": "Charts And Visualizations specification", "version": "charts-and-visualizations-v1", "status": "Adopted", "completeness": 85, "summary": "Charts And Visualizations baseline for the 14 design system ui batch. This batch contains implementation specifications for visual design system, components, colors, and accessibility.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("charts_and_visualization", 1, {"label": "Charts And Visualizations extension", "version": "charts-and-visualizations-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the charts and visualizations baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("charts_and_visualization", "charts_and_visualizations", seed);
export const handlers = makeGovernanceHandlers(store, "charts and visualizations records");
