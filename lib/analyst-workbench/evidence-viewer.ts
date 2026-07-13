import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 08-bank-analyst-workbench — evidence viewers on the shared governance factory; live surfaces at /app/analyst.
const seed = [
  seedRecord("an_evidence", 0, {"label": "Evidence register layout", "version": "evidence-v1", "status": "Adopted", "completeness": 82, "summary": "Source-linked evidence rows: source, observation period, freshness, completeness, verification status, and link to the underlying record.", "detail": "Every summarized metric traces to its source snapshot; missing evidence is shown as missing."}),
  seedRecord("an_evidence", 1, {"label": "Document preview policy", "version": "evidence-doc-v1", "status": "Adopted", "completeness": 78, "summary": "Metadata-only document rows; file contents never render inline in the workbench.", "detail": "Redaction enforced upstream."}),
];
export const store = createGovernanceStore("an_evidence", "evidence_viewer", seed);
export const handlers = makeGovernanceHandlers(store, "evidence viewers");
