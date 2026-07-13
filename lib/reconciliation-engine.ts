import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-009 Reconciliation Engine — cross-source reconciliation runs that match bank, invoice, GST, and payroll
// signals into agreed canonical values, surfacing unmatched records for analyst review.
export type ReconciliationStatus = "Reconciled" | "Needs review" | "Unmatched";
export type ReconciliationRun = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: ReconciliationStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; matched_pairs: number; explanation: string; last_run_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type ReconciliationSnapshot = { id: string; run_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; reconciliation_summary: string; coverage_summary: string; immutable: true };
export const RECONCILIATION_STATUSES: ReconciliationStatus[] = ["Reconciled", "Needs review", "Unmatched"];
let runs: ReconciliationRun[] = [
  { id: "reconciliation_run_demo_001", label: "Bank ↔ invoice turnover", source_system: "Bank transactions + invoices", masked_reference: "REC-••••-6605", purpose: "Turnover reconciliation", status: "Reconciled", source_id: "synthetic_recon_2026_07", source_observed_at: "2026-07-13T10:10:00.000Z", freshness: "Current", completeness: 89, matched_pairs: 318, explanation: "Bank credits were reconciled against sales invoices with 318 matched pairs. Residual differences were explained by timing and were within tolerance.", last_run_at: "2026-07-13T10:10:00.000Z", created_at: "2026-07-13T10:10:00.000Z", updated_at: "2026-07-13T10:10:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "reconciliation_run_demo_002", label: "GST ↔ invoice turnover", source_system: "GST filings + invoices", masked_reference: "REC-••••-1174", purpose: "Compliance reconciliation", status: "Needs review", source_id: "synthetic_recon_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 60, matched_pairs: 96, explanation: "Reported GST turnover exceeds matched invoice turnover for two periods; unmatched records need analyst review before reconciliation.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: ReconciliationSnapshot[] = [
  { id: "reconciliation_snapshot_demo_001", run_id: "reconciliation_run_demo_001", source_id: "synthetic_recon_2026_07", observed_at: "2026-07-13T10:10:00.000Z", freshness: "Current", completeness: 89, reconciliation_summary: "318 bank-to-invoice pairs matched; unmatched residuals were within a 3% timing tolerance.", coverage_summary: "The run covers one quarter; each matched pair retains both contributing source ids.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getReconciliationRuns() { return { runs, source_snapshots: snapshots }; }
export function getReconciliationRun(id: string) { return runs.find((run) => run.id === id); }
export function createReconciliationRun(input: Pick<ReconciliationRun, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const run: ReconciliationRun = { id: `reconciliation_run_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_recon_request", source_observed_at: now, freshness: "Current", completeness: 0, matched_pairs: 0, explanation: "Run this synthetic reconciliation to match records across sources. Unmatched records are surfaced for review.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  runs = [run, ...runs];
  writeAudit("reconciliation_engine.created", run.id, actor);
  return run;
}
export function updateReconciliationRun(id: string, status: ReconciliationStatus, actor: string) {
  const current = getReconciliationRun(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const reconciled = status === "Reconciled";
  const updated: ReconciliationRun = { ...current, status, freshness: status === "Unmatched" ? "Stale" : current.freshness, completeness: reconciled ? Math.max(current.completeness, 85) : current.completeness, last_run_at: now, updated_at: now, updated_by: actor };
  runs = runs.map((run) => (run.id === id ? updated : run));
  writeAudit("reconciliation_engine.updated", id, actor);
  return updated;
}
export function reconciliationEngineAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
