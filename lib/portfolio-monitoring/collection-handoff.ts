import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 09-portfolio-monitoring — collection handoffs on the shared governance factory; live surfaces at /app/portfolio and /app/watchlist.
const seed = [
  seedRecord("pf_handoff", 0, {"label": "Handoff policy", "version": "handoff-v1", "status": "Adopted", "completeness": 80, "summary": "Critical band plus PD 25%+ for two cycles triggers collections handoff with complete evidence pack and audit entry.", "detail": "Handoff never automatic on one assessment; reviewer confirmation required."}),
  seedRecord("pf_handoff", 1, {"label": "Handoff evidence pack", "version": "handoff-pack-v1", "status": "Adopted", "completeness": 76, "summary": "Pack contents: score/PD history, alerts, notes, and decision ledger extract.", "detail": "Masked identifiers throughout."}),
];
export const store = createGovernanceStore("pf_handoff", "collection_handoff", seed);
export const handlers = makeGovernanceHandlers(store, "collection handoffs");
