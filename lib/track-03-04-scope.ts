import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";

export { apiError, getActor, isAllowedRole, traceId };

export type ScopeItem = {
  id: string;
  track: "Track 03" | "Track 04";
  capability: string;
  outcome: string;
  status: "In scope" | "Planned";
  confidence: number;
  explanation: string;
  source_id: string;
  source_observed_at: string;
  freshness: "Current" | "Stale";
  completeness: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};

let scopeItems: ScopeItem[] = [
  { id: "scope_fhc_001", track: "Track 03", capability: "Financial Health Card", outcome: "Turn consented alternate data into a consistent credit-readiness view.", status: "In scope", confidence: 90, explanation: "Synthetic data establishes a reviewable baseline; sandbox adapters can replace the source without changing the scope contract.", source_id: "scope_brief_03_v1", source_observed_at: "2026-07-12T08:00:00.000Z", freshness: "Current", completeness: 100, created_at: "2026-07-12T08:00:00.000Z", updated_at: "2026-07-12T08:00:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "scope_risk_001", track: "Track 04", capability: "Default risk early warning", outcome: "Surface explainable stress signals for analyst-led action.", status: "In scope", confidence: 84, explanation: "Signals are decision support only. Model validation and autonomous decisions remain explicitly out of scope.", source_id: "scope_brief_04_v1", source_observed_at: "2026-07-12T08:00:00.000Z", freshness: "Current", completeness: 92, created_at: "2026-07-12T08:00:00.000Z", updated_at: "2026-07-12T08:00:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "scope_connectors_001", track: "Track 03", capability: "Sandbox data connectors", outcome: "Prepare adapters for authorized partner sandboxes.", status: "Planned", confidence: 62, explanation: "No live GST, UPI, AA, or OCEN calls are made until partner authorization is available.", source_id: "connector_readiness_01", source_observed_at: "2026-05-15T08:00:00.000Z", freshness: "Stale", completeness: 60, created_at: "2026-07-12T08:00:00.000Z", updated_at: "2026-07-12T08:00:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const auditEvents: Array<Record<string, string>> = [];

export function listScopeItems() { return scopeItems; }
export function getScopeItem(id: string) { return scopeItems.find((item) => item.id === id); }
export function createScopeItem(input: Pick<ScopeItem, "track" | "capability" | "outcome" | "explanation">, actor: string) {
  const now = new Date().toISOString();
  const item: ScopeItem = { id: `scope_${crypto.randomUUID()}`, ...input, status: "Planned", confidence: 0, source_id: "manual_scope_entry", source_observed_at: now, freshness: "Current", completeness: 0, created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  scopeItems = [item, ...scopeItems];
  writeAudit("track_scope.created", item.id, actor);
  return item;
}
export function updateScopeItem(id: string, input: Partial<Pick<ScopeItem, "capability" | "outcome" | "explanation" | "status">>, actor: string) {
  const item = getScopeItem(id);
  if (!item) return undefined;
  const updated = { ...item, ...input, updated_at: new Date().toISOString(), updated_by: actor };
  scopeItems = scopeItems.map((entry) => entry.id === id ? updated : entry);
  writeAudit("track_scope.updated", id, actor);
  return updated;
}
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
export function scopeAuditEventCount() { return auditEvents.length; }
