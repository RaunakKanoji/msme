import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-004 Canonical Invoices — normalized sales and purchase invoices for turnover and cash-flow corroboration.
// Only masked references and aggregates are surfaced; raw invoice line items are not exposed in UI-facing tables.
export type InvoiceStatus = "Normalized" | "Needs review" | "Quarantined";
export type CanonicalInvoice = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: InvoiceStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; invoice_count: number; explanation: string; last_normalized_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type InvoiceSnapshot = { id: string; batch_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; invoice_summary: string; coverage_summary: string; immutable: true };
export const INVOICE_STATUSES: InvoiceStatus[] = ["Normalized", "Needs review", "Quarantined"];
let batches: CanonicalInvoice[] = [
  { id: "invoice_batch_demo_001", label: "Sales invoices · Q1 FY26", source_system: "Accounting export (synthetic)", masked_reference: "INV-SAL-••••-9052", purpose: "Turnover corroboration", status: "Normalized", source_id: "synthetic_invoices_2026_07", source_observed_at: "2026-07-11T11:00:00.000Z", freshness: "Current", completeness: 88, invoice_count: 342, explanation: "Sales invoices were normalized to the canonical schema with counterparties masked and amounts standardized. Duplicate invoice numbers were deduplicated.", last_normalized_at: "2026-07-11T11:00:00.000Z", created_at: "2026-07-11T11:00:00.000Z", updated_at: "2026-07-11T11:00:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "invoice_batch_demo_002", label: "Purchase invoices · Q1 FY26", source_system: "Accounting export (synthetic)", masked_reference: "INV-PUR-••••-4477", purpose: "Working-capital review", status: "Needs review", source_id: "synthetic_invoices_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 54, invoice_count: 118, explanation: "Several purchase invoices are missing tax fields and were quarantined pending review before promotion.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: InvoiceSnapshot[] = [
  { id: "invoice_snapshot_demo_001", batch_id: "invoice_batch_demo_001", source_id: "synthetic_invoices_2026_07", observed_at: "2026-07-11T11:00:00.000Z", freshness: "Current", completeness: 88, invoice_summary: "342 sales invoices normalized with consistent tax and currency fields.", coverage_summary: "One quarter of continuous invoicing is covered; two low-value drafts were excluded.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getCanonicalInvoices() { return { batches, source_snapshots: snapshots }; }
export function getCanonicalInvoice(id: string) { return batches.find((batch) => batch.id === id); }
export function createCanonicalInvoice(input: Pick<CanonicalInvoice, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const batch: CanonicalInvoice = { id: `invoice_batch_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_invoice_request", source_observed_at: now, freshness: "Current", completeness: 0, invoice_count: 0, explanation: "Confirm normalization checks to promote this synthetic invoice batch. Raw line items are not stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  batches = [batch, ...batches];
  writeAudit("canonical_invoices.created", batch.id, actor);
  return batch;
}
export function updateCanonicalInvoice(id: string, status: InvoiceStatus, actor: string) {
  const current = getCanonicalInvoice(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const normalized = status === "Normalized";
  const updated: CanonicalInvoice = { ...current, status, freshness: status === "Quarantined" ? "Stale" : current.freshness, completeness: normalized ? Math.max(current.completeness, 85) : current.completeness, last_normalized_at: normalized ? now : current.last_normalized_at, updated_at: now, updated_by: actor };
  batches = batches.map((batch) => (batch.id === id ? updated : batch));
  writeAudit("canonical_invoices.updated", id, actor);
  return updated;
}
export function canonicalInvoicesAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
