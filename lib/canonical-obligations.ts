import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-007 Canonical Obligations — normalized existing obligations (EMIs, loans, statutory dues) for debt-servicing
// signals. Only masked references and aggregates are surfaced; raw lender/account payloads are not exposed.
export type ObligationStatus = "Normalized" | "Needs review" | "Quarantined";
export type CanonicalObligation = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: ObligationStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; obligation_count: number; explanation: string; last_normalized_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type ObligationSnapshot = { id: string; portfolio_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; obligation_summary: string; coverage_summary: string; immutable: true };
export const OBLIGATION_STATUSES: ObligationStatus[] = ["Normalized", "Needs review", "Quarantined"];
let portfolios: CanonicalObligation[] = [
  { id: "obligation_portfolio_demo_001", label: "Active loan EMIs", source_system: "Bank statement + bureau (synthetic)", masked_reference: "OBL-EMI-••••-2288", purpose: "Debt-servicing normalization", status: "Normalized", source_id: "synthetic_obligations_2026_07", source_observed_at: "2026-07-12T09:20:00.000Z", freshness: "Current", completeness: 86, obligation_count: 4, explanation: "Recurring EMI debits were matched to canonical obligation records with lender identifiers masked. Amounts and due dates are standardized for debt-service signals.", last_normalized_at: "2026-07-12T09:20:00.000Z", created_at: "2026-07-12T09:20:00.000Z", updated_at: "2026-07-12T09:20:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "obligation_portfolio_demo_002", label: "Statutory dues", source_system: "GST + EPFO (synthetic)", masked_reference: "OBL-STA-••••-6640", purpose: "Compliance obligation review", status: "Needs review", source_id: "synthetic_obligations_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 55, obligation_count: 2, explanation: "One statutory due could not be matched to a source payment and is quarantined pending review before promotion.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: ObligationSnapshot[] = [
  { id: "obligation_snapshot_demo_001", portfolio_id: "obligation_portfolio_demo_001", source_id: "synthetic_obligations_2026_07", observed_at: "2026-07-12T09:20:00.000Z", freshness: "Current", completeness: 86, obligation_summary: "Four active EMIs normalized with standardized instalment amounts and due dates.", coverage_summary: "Twelve months of recurring debits corroborate each obligation; no missed-payment inference is asserted.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getCanonicalObligations() { return { portfolios, source_snapshots: snapshots }; }
export function getCanonicalObligation(id: string) { return portfolios.find((portfolio) => portfolio.id === id); }
export function createCanonicalObligation(input: Pick<CanonicalObligation, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const portfolio: CanonicalObligation = { id: `obligation_portfolio_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_obligation_request", source_observed_at: now, freshness: "Current", completeness: 0, obligation_count: 0, explanation: "Confirm normalization checks to promote this synthetic obligation portfolio. Raw lender payloads are not stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  portfolios = [portfolio, ...portfolios];
  writeAudit("canonical_obligations.created", portfolio.id, actor);
  return portfolio;
}
export function updateCanonicalObligation(id: string, status: ObligationStatus, actor: string) {
  const current = getCanonicalObligation(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const normalized = status === "Normalized";
  const updated: CanonicalObligation = { ...current, status, freshness: status === "Quarantined" ? "Stale" : current.freshness, completeness: normalized ? Math.max(current.completeness, 85) : current.completeness, last_normalized_at: normalized ? now : current.last_normalized_at, updated_at: now, updated_by: actor };
  portfolios = portfolios.map((portfolio) => (portfolio.id === id ? updated : portfolio));
  writeAudit("canonical_obligations.updated", id, actor);
  return updated;
}
export function canonicalObligationsAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
