import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-006 Canonical Payroll — normalized, aggregated payroll and EPFO compliance signals. Only masked references and
// aggregates (headcount, remittance regularity) are surfaced; employee-level payloads are never exposed.
export type PayrollStatus = "Normalized" | "Needs review" | "Quarantined";
export type CanonicalPayrollRecord = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: PayrollStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; headcount: number; explanation: string; last_normalized_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type PayrollSnapshot = { id: string; register_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; payroll_summary: string; coverage_summary: string; immutable: true };
export const PAYROLL_STATUSES: PayrollStatus[] = ["Normalized", "Needs review", "Quarantined"];
let registers: CanonicalPayrollRecord[] = [
  { id: "payroll_register_demo_001", label: "EPFO remittances · 12 months", source_system: "EPFO (synthetic)", masked_reference: "PAY-••••-7714", purpose: "Payroll stability normalization", status: "Normalized", source_id: "synthetic_epfo_2026_07", source_observed_at: "2026-07-10T07:30:00.000Z", freshness: "Current", completeness: 87, headcount: 42, explanation: "Monthly EPFO remittances were normalized to aggregated headcount and on-time contribution flags. No employee-level records are stored or displayed.", last_normalized_at: "2026-07-10T07:30:00.000Z", created_at: "2026-07-10T07:30:00.000Z", updated_at: "2026-07-10T07:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "payroll_register_demo_002", label: "Salary disbursements · 6 months", source_system: "Bank payroll batch (synthetic)", masked_reference: "PAY-••••-2093", purpose: "Wage-outflow corroboration", status: "Needs review", source_id: "synthetic_payroll_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 52, headcount: 38, explanation: "Two months of disbursement batches are incomplete and quarantined pending review before promotion.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: PayrollSnapshot[] = [
  { id: "payroll_snapshot_demo_001", register_id: "payroll_register_demo_001", source_id: "synthetic_epfo_2026_07", observed_at: "2026-07-10T07:30:00.000Z", freshness: "Current", completeness: 87, payroll_summary: "Twelve months of EPFO remittances normalized with stable aggregated headcount and on-time contributions.", coverage_summary: "A rolling year of compliance is covered; individual employee data is excluded by design.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getCanonicalPayroll() { return { registers, source_snapshots: snapshots }; }
export function getCanonicalPayrollRecord(id: string) { return registers.find((register) => register.id === id); }
export function createCanonicalPayrollRecord(input: Pick<CanonicalPayrollRecord, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const register: CanonicalPayrollRecord = { id: `payroll_register_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_payroll_request", source_observed_at: now, freshness: "Current", completeness: 0, headcount: 0, explanation: "Confirm normalization checks to promote this synthetic payroll register. Employee-level payloads are never stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  registers = [register, ...registers];
  writeAudit("canonical_payroll.created", register.id, actor);
  return register;
}
export function updateCanonicalPayrollRecord(id: string, status: PayrollStatus, actor: string) {
  const current = getCanonicalPayrollRecord(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const normalized = status === "Normalized";
  const updated: CanonicalPayrollRecord = { ...current, status, freshness: status === "Quarantined" ? "Stale" : current.freshness, completeness: normalized ? Math.max(current.completeness, 85) : current.completeness, last_normalized_at: normalized ? now : current.last_normalized_at, updated_at: now, updated_by: actor };
  registers = registers.map((register) => (register.id === id ? updated : register));
  writeAudit("canonical_payroll.updated", id, actor);
  return updated;
}
export function canonicalPayrollAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
