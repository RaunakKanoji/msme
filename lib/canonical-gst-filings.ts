import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-005 Canonical GST Filings — normalized GST return summaries for turnover and compliance signals. Only masked
// GSTIN references and aggregates are surfaced; raw return payloads are not exposed in UI-facing tables.
export type GstFilingStatus = "Normalized" | "Needs review" | "Quarantined";
export type CanonicalGstFiling = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: GstFilingStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; period_count: number; explanation: string; last_normalized_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type GstFilingSnapshot = { id: string; series_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; filing_summary: string; coverage_summary: string; immutable: true };
export const GST_FILING_STATUSES: GstFilingStatus[] = ["Normalized", "Needs review", "Quarantined"];
let series: CanonicalGstFiling[] = [
  { id: "gst_series_demo_001", label: "GSTR-3B · 12 months", source_system: "GSTN (synthetic)", masked_reference: "GST-••••-3360", purpose: "Turnover and compliance normalization", status: "Normalized", source_id: "synthetic_gst_3b_2026_07", source_observed_at: "2026-07-12T08:00:00.000Z", freshness: "Current", completeness: 90, period_count: 12, explanation: "Monthly GSTR-3B summaries were normalized to canonical turnover and tax fields with filing-status flags retained. Raw returns are excluded from display.", last_normalized_at: "2026-07-12T08:00:00.000Z", created_at: "2026-07-12T08:00:00.000Z", updated_at: "2026-07-12T08:00:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "gst_series_demo_002", label: "GSTR-1 · 12 months", source_system: "GSTN (synthetic)", masked_reference: "GST-••••-7719", purpose: "Outward-supply corroboration", status: "Needs review", source_id: "synthetic_gst_1_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 57, period_count: 8, explanation: "Four monthly periods are missing and the series is quarantined pending review before promotion.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: GstFilingSnapshot[] = [
  { id: "gst_snapshot_demo_001", series_id: "gst_series_demo_001", source_id: "synthetic_gst_3b_2026_07", observed_at: "2026-07-12T08:00:00.000Z", freshness: "Current", completeness: 90, filing_summary: "Twelve monthly GSTR-3B periods normalized with on-time filing flags for eleven of twelve months.", coverage_summary: "One rolling year of continuous filing is covered; the latest period is provisional.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getCanonicalGstFilings() { return { series, source_snapshots: snapshots }; }
export function getCanonicalGstFiling(id: string) { return series.find((item) => item.id === id); }
export function createCanonicalGstFiling(input: Pick<CanonicalGstFiling, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const filing: CanonicalGstFiling = { id: `gst_series_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_gst_request", source_observed_at: now, freshness: "Current", completeness: 0, period_count: 0, explanation: "Confirm normalization checks to promote this synthetic GST series. Raw returns are not stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  series = [filing, ...series];
  writeAudit("canonical_gst_filings.created", filing.id, actor);
  return filing;
}
export function updateCanonicalGstFiling(id: string, status: GstFilingStatus, actor: string) {
  const current = getCanonicalGstFiling(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const normalized = status === "Normalized";
  const updated: CanonicalGstFiling = { ...current, status, freshness: status === "Quarantined" ? "Stale" : current.freshness, completeness: normalized ? Math.max(current.completeness, 85) : current.completeness, last_normalized_at: normalized ? now : current.last_normalized_at, updated_at: now, updated_by: actor };
  series = series.map((item) => (item.id === id ? updated : item));
  writeAudit("canonical_gst_filings.updated", id, actor);
  return updated;
}
export function canonicalGstFilingsAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
