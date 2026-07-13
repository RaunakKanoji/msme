import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-002 Canonical Party Model — deduplicated, source-linked view of the businesses and people behind an
// application. Records carry source ids/timestamps for every merged attribute; raw identifiers are not exposed.
export type PartyStatus = "Resolved" | "Needs review" | "Merged conflict";
export type CanonicalParty = { id: string; label: string; party_type: "Business" | "Promoter" | "Guarantor"; masked_reference: string; purpose: string; status: PartyStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; source_count: number; explanation: string; last_resolved_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type PartySnapshot = { id: string; party_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; resolution_summary: string; unresolved_summary: string; immutable: true };
export const PARTY_STATUSES: PartyStatus[] = ["Resolved", "Needs review", "Merged conflict"];
let parties: CanonicalParty[] = [
  { id: "party_demo_001", label: "Saraswati Precision Works", party_type: "Business", masked_reference: "PARTY-BUS-••••-3391", purpose: "Applicant identity resolution", status: "Resolved", source_id: "synthetic_kyb_udyam_2026_07", source_observed_at: "2026-07-12T10:15:00.000Z", freshness: "Current", completeness: 94, source_count: 3, explanation: "The business entity was resolved by matching KYB, Udyam, and GST identifiers to one canonical party. Each attribute retains its source id and timestamp.", last_resolved_at: "2026-07-12T10:15:00.000Z", created_at: "2026-07-12T10:15:00.000Z", updated_at: "2026-07-12T10:15:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "party_demo_002", label: "Meera Nair", party_type: "Promoter", masked_reference: "PARTY-PRM-••••-8820", purpose: "Promoter identity resolution", status: "Needs review", source_id: "synthetic_promoter_2026_06", source_observed_at: "2026-06-28T09:00:00.000Z", freshness: "Stale", completeness: 62, source_count: 2, explanation: "Two promoter records disagree on a masked contact attribute and need analyst confirmation before the party is resolved.", created_at: "2026-06-28T09:00:00.000Z", updated_at: "2026-06-28T09:00:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: PartySnapshot[] = [
  { id: "party_snapshot_demo_001", party_id: "party_demo_001", source_id: "synthetic_kyb_udyam_2026_07", observed_at: "2026-07-12T10:15:00.000Z", freshness: "Current", completeness: 94, resolution_summary: "Three sources agreed on legal name, registration, and principal place of business.", unresolved_summary: "No unresolved conflicts remain; one alternate trade name is retained for reference.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getCanonicalParties() { return { parties, source_snapshots: snapshots }; }
export function getCanonicalParty(id: string) { return parties.find((party) => party.id === id); }
export function createCanonicalParty(input: Pick<CanonicalParty, "label" | "purpose" | "party_type" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const party: CanonicalParty = { id: `party_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_party_request", source_observed_at: now, freshness: "Current", completeness: 0, source_count: 1, explanation: "Confirm the matched sources to resolve this synthetic party. Raw identifiers are not stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  parties = [party, ...parties];
  writeAudit("canonical_party_model.created", party.id, actor);
  return party;
}
export function updateCanonicalParty(id: string, status: PartyStatus, actor: string) {
  const current = getCanonicalParty(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const resolved = status === "Resolved";
  const updated: CanonicalParty = { ...current, status, freshness: status === "Merged conflict" ? "Stale" : current.freshness, completeness: resolved ? Math.max(current.completeness, 85) : current.completeness, last_resolved_at: resolved ? now : current.last_resolved_at, updated_at: now, updated_by: actor };
  parties = parties.map((party) => (party.id === id ? updated : party));
  writeAudit("canonical_party_model.updated", id, actor);
  return updated;
}
export function canonicalPartyModelAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
