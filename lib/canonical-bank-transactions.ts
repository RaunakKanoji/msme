import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-003 Canonical Bank Transactions — normalized, deduplicated bank-transaction ledger derived from consented
// account data. Amounts are decimal-safe upstream; only masked account references and aggregates are surfaced.
export type BankTransactionStatus = "Normalized" | "Needs review" | "Quarantined";
export type CanonicalBankTransaction = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; status: BankTransactionStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; transaction_count: number; explanation: string; last_normalized_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type BankTransactionSnapshot = { id: string; ledger_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; normalization_summary: string; coverage_summary: string; immutable: true };
export const BANK_TRANSACTION_STATUSES: BankTransactionStatus[] = ["Normalized", "Needs review", "Quarantined"];
let ledgers: CanonicalBankTransaction[] = [
  { id: "txn_ledger_demo_001", label: "Current account · 12 months", source_system: "Setu AA / HDFC (synthetic)", masked_reference: "TXN-AC-••••-4417", purpose: "Cash-flow ledger normalization", status: "Normalized", source_id: "synthetic_aa_txns_2026_07", source_observed_at: "2026-07-13T09:45:00.000Z", freshness: "Current", completeness: 91, transaction_count: 1284, explanation: "Credits and debits were normalized to the canonical schema with deduplication hashes. Balances and running totals use decimal-safe arithmetic upstream.", last_normalized_at: "2026-07-13T09:45:00.000Z", created_at: "2026-07-13T09:45:00.000Z", updated_at: "2026-07-13T09:45:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "txn_ledger_demo_002", label: "Savings account · 6 months", source_system: "Setu AA / SBI (synthetic)", masked_reference: "TXN-AC-••••-9931", purpose: "Supplementary inflow review", status: "Needs review", source_id: "synthetic_aa_txns_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 58, transaction_count: 412, explanation: "A subset of transactions failed timestamp parsing and were quarantined pending review before this ledger is promoted.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: BankTransactionSnapshot[] = [
  { id: "txn_snapshot_demo_001", ledger_id: "txn_ledger_demo_001", source_id: "synthetic_aa_txns_2026_07", observed_at: "2026-07-13T09:45:00.000Z", freshness: "Current", completeness: 91, normalization_summary: "1,284 transactions normalized across CREDIT, DEBIT, and OTHER types with deduplication applied.", coverage_summary: "Twelve continuous months are covered; two days had no reported activity.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getCanonicalBankTransactions() { return { ledgers, source_snapshots: snapshots }; }
export function getCanonicalBankTransaction(id: string) { return ledgers.find((ledger) => ledger.id === id); }
export function createCanonicalBankTransaction(input: Pick<CanonicalBankTransaction, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const ledger: CanonicalBankTransaction = { id: `txn_ledger_${crypto.randomUUID()}`, ...input, status: "Needs review", source_id: "synthetic_bank_txn_request", source_observed_at: now, freshness: "Current", completeness: 0, transaction_count: 0, explanation: "Confirm normalization checks to promote this synthetic ledger. Raw account numbers are not stored in UI-facing tables.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  ledgers = [ledger, ...ledgers];
  writeAudit("canonical_bank_transactions.created", ledger.id, actor);
  return ledger;
}
export function updateCanonicalBankTransaction(id: string, status: BankTransactionStatus, actor: string) {
  const current = getCanonicalBankTransaction(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const normalized = status === "Normalized";
  const updated: CanonicalBankTransaction = { ...current, status, freshness: status === "Quarantined" ? "Stale" : current.freshness, completeness: normalized ? Math.max(current.completeness, 85) : current.completeness, last_normalized_at: normalized ? now : current.last_normalized_at, updated_at: now, updated_by: actor };
  ledgers = ledgers.map((ledger) => (ledger.id === id ? updated : ledger));
  writeAudit("canonical_bank_transactions.updated", id, actor);
  return updated;
}
export function canonicalBankTransactionsAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
