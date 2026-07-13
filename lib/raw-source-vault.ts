import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-001 Raw Source Vault — immutable, redacted, source-linked storage of raw ingested payloads. Raw sensitive
// payloads are never exposed to UI-facing tables; only masked references and coverage summaries are surfaced.
export type RawPayloadStatus = "Stored" | "Pending" | "Quarantined";
export type RawPayload = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: RawPayloadStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; redaction: "Redacted summary" | "Raw excluded"; explanation: string; last_ingested_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type RawSourceSnapshot = { id: string; payload_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; coverage_summary: string; retention_summary: string; immutable: true };
export const RAW_PAYLOAD_STATUSES: RawPayloadStatus[] = ["Stored", "Pending", "Quarantined"];
let payloads: RawPayload[] = [
  { id: "raw_payload_demo_001", label: "Account Aggregator FI bundle", source_system: "Setu AA (sandbox)", masked_reference: "RAW-AA-••••-7741", purpose: "Financial health ingestion", status: "Stored", source_id: "synthetic_aa_fi_2026_07", source_observed_at: "2026-07-13T09:40:00.000Z", freshness: "Current", completeness: 92, redaction: "Redacted summary", explanation: "The raw AA financial-information bundle is stored immutably with source id and timestamp. Only a redacted coverage summary is surfaced; account numbers and holder identifiers stay out of UI-facing tables.", last_ingested_at: "2026-07-13T09:40:00.000Z", created_at: "2026-07-13T09:40:00.000Z", updated_at: "2026-07-13T09:40:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "raw_payload_demo_002", label: "GST return export", source_system: "GSTN (synthetic)", masked_reference: "RAW-GST-••••-2210", purpose: "Turnover corroboration", status: "Pending", source_id: "synthetic_gst_return_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 61, redaction: "Raw excluded", explanation: "A synthetic GST export is awaiting quality confirmation before it is promoted to stored status. Raw filing payloads are excluded from display.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: RawSourceSnapshot[] = [
  { id: "raw_snapshot_demo_001", payload_id: "raw_payload_demo_001", source_id: "synthetic_aa_fi_2026_07", observed_at: "2026-07-13T09:40:00.000Z", freshness: "Current", completeness: 92, coverage_summary: "Twelve months of deposit-account summaries and transactions were captured across two linked accounts.", retention_summary: "Stored under the consented data-life policy; access is purpose-limited and audit-logged.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getRawSourceVault() { return { payloads, source_snapshots: snapshots }; }
export function getRawPayload(id: string) { return payloads.find((payload) => payload.id === id); }
export function createRawPayload(input: Pick<RawPayload, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const payload: RawPayload = { id: `raw_payload_${crypto.randomUUID()}`, ...input, status: "Pending", source_id: "synthetic_raw_payload_request", source_observed_at: now, freshness: "Current", completeness: 0, redaction: "Raw excluded", explanation: "Confirm data-quality checks to promote this synthetic payload to stored status. Raw payloads are never displayed or stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  payloads = [payload, ...payloads];
  writeAudit("raw_source_vault.created", payload.id, actor);
  return payload;
}
export function updateRawPayload(id: string, status: RawPayloadStatus, actor: string) {
  const current = getRawPayload(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const stored = status === "Stored";
  const updated: RawPayload = { ...current, status, freshness: status === "Quarantined" ? "Stale" : current.freshness, completeness: stored ? Math.max(current.completeness, 80) : current.completeness, last_ingested_at: stored ? now : current.last_ingested_at, updated_at: now, updated_by: actor };
  payloads = payloads.map((payload) => (payload.id === id ? updated : payload));
  writeAudit("raw_source_vault.updated", id, actor);
  return updated;
}
export function rawSourceVaultAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
