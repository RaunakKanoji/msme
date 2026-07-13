import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";

export { apiError, getActor, isAllowedRole, traceId };

export type ConsentStatus = "Active" | "Expiring soon" | "Revoked";
export type Consent = {
  id: string; business_name: string; purpose: string; status: ConsentStatus; granted_at: string; expires_at: string;
  connector_account_id: string; source_id: string; source_observed_at: string; freshness: "Current" | "Stale";
  completeness: number; explanation: string; created_at: string; updated_at: string; created_by: string; updated_by: string;
};
export type ConnectorAccount = { id: string; name: string; category: string; status: "Connected" | "Attention needed"; last_sync_at: string; freshness: "Current" | "Stale"; completeness: number; detail: string };
export type SyncJob = { id: string; connector_account_id: string; status: "Completed" | "Needs review"; completed_at: string; records_received: number; source_id: string };
export type DataAccessLog = { id: string; consent_id: string; purpose: string; accessed_at: string; actor: string; outcome: "Allowed" | "Denied" };

let consents: Consent[] = [
  { id: "consent_demo_001", business_name: "Saraswati Precision Works", purpose: "Financial health assessment", status: "Active", granted_at: "2026-06-18T09:30:00.000Z", expires_at: "2026-12-18T09:30:00.000Z", connector_account_id: "connector_aa_demo_001", source_id: "synthetic_consent_2026_07", source_observed_at: "2026-07-13T08:15:00.000Z", freshness: "Current", completeness: 100, explanation: "The business authorised purpose-limited access to account-aggregator summaries for its financial health assessment.", created_at: "2026-06-18T09:30:00.000Z", updated_at: "2026-07-13T08:15:00.000Z", created_by: "demo.borrower", updated_by: "system.seed" },
  { id: "consent_demo_002", business_name: "Saraswati Precision Works", purpose: "GST turnover verification", status: "Expiring soon", granted_at: "2026-01-20T10:00:00.000Z", expires_at: "2026-07-20T10:00:00.000Z", connector_account_id: "connector_gst_demo_001", source_id: "synthetic_consent_2026_07", source_observed_at: "2026-07-13T08:15:00.000Z", freshness: "Current", completeness: 92, explanation: "Consent supports a limited GST turnover summary. Renew it to keep the assessment evidence current.", created_at: "2026-01-20T10:00:00.000Z", updated_at: "2026-07-13T08:15:00.000Z", created_by: "demo.borrower", updated_by: "system.seed" },
  { id: "consent_demo_003", business_name: "Saraswati Precision Works", purpose: "UPI collections trend", status: "Revoked", granted_at: "2026-02-10T10:00:00.000Z", expires_at: "2026-08-10T10:00:00.000Z", connector_account_id: "connector_upi_demo_001", source_id: "synthetic_consent_2026_06", source_observed_at: "2026-06-30T16:00:00.000Z", freshness: "Stale", completeness: 74, explanation: "This consent was withdrawn. No new UPI collection information can be accessed for this purpose.", created_at: "2026-02-10T10:00:00.000Z", updated_at: "2026-07-02T13:20:00.000Z", created_by: "demo.borrower", updated_by: "demo.borrower" },
];
const connectorAccounts: ConnectorAccount[] = [
  { id: "connector_aa_demo_001", name: "Account Aggregator", category: "Bank account summaries", status: "Connected", last_sync_at: "2026-07-13T07:50:00.000Z", freshness: "Current", completeness: 96, detail: "Ninety-day balances and cash-flow summaries are available; raw transactions are not displayed." },
  { id: "connector_gst_demo_001", name: "GST adapter", category: "Turnover summaries", status: "Attention needed", last_sync_at: "2026-06-30T12:10:00.000Z", freshness: "Stale", completeness: 78, detail: "Latest filing confirmation needs a renewed consent and a refresh." },
  { id: "connector_upi_demo_001", name: "UPI collections adapter", category: "Collections trends", status: "Attention needed", last_sync_at: "2026-06-30T16:00:00.000Z", freshness: "Stale", completeness: 74, detail: "Access stopped after consent was revoked." },
];
const syncJobs: SyncJob[] = [
  { id: "sync_demo_001", connector_account_id: "connector_aa_demo_001", status: "Completed", completed_at: "2026-07-13T07:50:00.000Z", records_received: 3, source_id: "synthetic_aa_summary_2026_07" },
  { id: "sync_demo_002", connector_account_id: "connector_gst_demo_001", status: "Needs review", completed_at: "2026-06-30T12:10:00.000Z", records_received: 1, source_id: "synthetic_gst_summary_2026_06" },
];
const accessLogs: DataAccessLog[] = [{ id: "access_demo_001", consent_id: "consent_demo_001", purpose: "Financial health assessment", accessed_at: "2026-07-13T08:00:00.000Z", actor: "demo.bank.analyst", outcome: "Allowed" }];
const auditEvents: Array<Record<string, string>> = [];

export function getConsentDashboard() { return { consents, connector_accounts: connectorAccounts, sync_jobs: syncJobs, data_access_logs: accessLogs }; }
export function getConsent(id: string) { return consents.find((consent) => consent.id === id); }
export function createConsent(input: Pick<Consent, "business_name" | "purpose" | "connector_account_id">, actor: string) {
  const connector = connectorAccounts.find((item) => item.id === input.connector_account_id); const now = new Date().toISOString();
  const consent: Consent = { id: `consent_${crypto.randomUUID()}`, ...input, status: "Active", granted_at: now, expires_at: new Date(Date.now() + 180 * 86400000).toISOString(), source_id: "manual_consent_capture", source_observed_at: now, freshness: "Current", completeness: connector ? 100 : 0, explanation: "Purpose-limited consent was recorded for the selected synthetic connector.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  consents = [consent, ...consents]; writeAudit("consent.created", consent.id, actor); return consent;
}
export function updateConsent(id: string, input: Pick<Consent, "status">, actor: string) {
  const current = getConsent(id); if (!current) return undefined; const updated = { ...current, ...input, updated_at: new Date().toISOString(), updated_by: actor };
  consents = consents.map((consent) => consent.id === id ? updated : consent); accessLogs.unshift({ id: `access_${crypto.randomUUID()}`, consent_id: id, purpose: current.purpose, accessed_at: updated.updated_at, actor, outcome: input.status === "Active" ? "Allowed" : "Denied" }); writeAudit("consent.updated", id, actor); return updated;
}
export function consentDashboardAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
