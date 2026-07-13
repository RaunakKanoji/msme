import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — analyst export packs on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_export", 0, {"label": "Export pack definition", "version": "export-pack-v1", "status": "Adopted", "completeness": 80, "summary": "Defines the reviewer export: decision workspace snapshot, policy results, factor attributions, and evidence register \u2014 masked identifiers only.", "detail": "Actual file generation lands with the reports module; definition is versioned now."}),
  seedRecord("an_export", 1, {"label": "Audit export definition", "version": "export-audit-v1", "status": "Adopted", "completeness": 78, "summary": "Read-only ledger extract for internal audit with access logging.", "detail": "Linked to decision-ledger-v1."}),
];
export const store = createGovernanceStore("an_export", "analyst_export_pack", seed);
export const handlers = makeGovernanceHandlers(store, "analyst export packs");
