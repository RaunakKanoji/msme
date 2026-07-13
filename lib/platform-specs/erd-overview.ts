import { createGovernanceStore, makeGovernanceHandlers, seedRecord, GOVERNANCE_STATUSES } from "../default-prediction/governance-store.ts";
export { GOVERNANCE_STATUSES };
// 17-001 Erd Overview (17-database) — governance records on the shared factory.
const seed = [
  seedRecord("erd_overview", 0, {"label": "Erd Overview specification", "version": "erd-overview-v1", "status": "Adopted", "completeness": 85, "summary": "Erd Overview baseline for the 17 database batch. This batch contains implementation specifications for database schemas, migrations, seeds, and persistence rules.", "detail": "Versioned demonstration record adopted for the prototype; production hardening tracked in the specification's known limitations."}),
  seedRecord("erd_overview", 1, {"label": "Erd Overview extension", "version": "erd-overview-v2-draft", "status": "Draft", "completeness": 25, "summary": "Draft extension of the erd overview baseline pending review.", "detail": "Held in draft; adoption requires review and does not affect the live baseline."}),
];
export const store = createGovernanceStore("erd_overview", "erd_overview", seed);
export const handlers = makeGovernanceHandlers(store, "erd overview records");
