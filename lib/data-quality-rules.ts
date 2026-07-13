import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-008 Data Quality Rules — versioned rules that evaluate canonical sources and report pass/warn/fail results.
// Rule results gate promotion into feature snapshots; explanations are surfaced for analyst review.
export type DataQualityStatus = "Passing" | "Warning" | "Failing";
export type DataQualityRule = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: DataQualityStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; checks_run: number; explanation: string; last_evaluated_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type DataQualitySnapshot = { id: string; rule_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; rule_summary: string; coverage_summary: string; immutable: true };
export const DATA_QUALITY_STATUSES: DataQualityStatus[] = ["Passing", "Warning", "Failing"];
let rules: DataQualityRule[] = [
  { id: "dq_rule_demo_001", label: "Transaction completeness ≥ 90%", source_system: "Canonical bank transactions", masked_reference: "DQ-COMPLETENESS-01", purpose: "Gate scoring inputs on coverage", status: "Passing", source_id: "synthetic_dq_run_2026_07", source_observed_at: "2026-07-13T10:05:00.000Z", freshness: "Current", completeness: 96, checks_run: 1284, explanation: "The completeness rule passed for the current ledger; coverage exceeds the 90% threshold required before scoring.", last_evaluated_at: "2026-07-13T10:05:00.000Z", created_at: "2026-07-01T10:05:00.000Z", updated_at: "2026-07-13T10:05:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "dq_rule_demo_002", label: "GST period continuity", source_system: "Canonical GST filings", masked_reference: "DQ-CONTINUITY-02", purpose: "Detect missing filing periods", status: "Warning", source_id: "synthetic_dq_run_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 71, checks_run: 12, explanation: "The continuity rule raised a warning because four GST periods are missing; downstream features will flag reduced confidence.", created_at: "2026-06-15T09:00:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: DataQualitySnapshot[] = [
  { id: "dq_snapshot_demo_001", rule_id: "dq_rule_demo_001", source_id: "synthetic_dq_run_2026_07", observed_at: "2026-07-13T10:05:00.000Z", freshness: "Current", completeness: 96, rule_summary: "1,284 transactions evaluated; completeness of 96% clears the scoring gate.", coverage_summary: "The rule version and thresholds are recorded immutably with the evaluation run.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getDataQualityRules() { return { rules, source_snapshots: snapshots }; }
export function getDataQualityRule(id: string) { return rules.find((rule) => rule.id === id); }
export function createDataQualityRule(input: Pick<DataQualityRule, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const rule: DataQualityRule = { id: `dq_rule_${crypto.randomUUID()}`, ...input, status: "Warning", source_id: "synthetic_dq_request", source_observed_at: now, freshness: "Current", completeness: 0, checks_run: 0, explanation: "Run this synthetic rule to record a pass/warn/fail result. Results gate promotion into feature snapshots.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  rules = [rule, ...rules];
  writeAudit("data_quality_rules.created", rule.id, actor);
  return rule;
}
export function updateDataQualityRule(id: string, status: DataQualityStatus, actor: string) {
  const current = getDataQualityRule(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const passing = status === "Passing";
  const updated: DataQualityRule = { ...current, status, freshness: status === "Failing" ? "Stale" : current.freshness, completeness: passing ? Math.max(current.completeness, 90) : current.completeness, last_evaluated_at: now, updated_at: now, updated_by: actor };
  rules = rules.map((rule) => (rule.id === id ? updated : rule));
  writeAudit("data_quality_rules.updated", id, actor);
  return updated;
}
export function dataQualityRulesAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
