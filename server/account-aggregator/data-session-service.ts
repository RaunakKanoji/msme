import { SetuConsentNotActiveError, SetuValidationError } from "./errors.ts"; import { getAccountAggregatorProvider } from "./provider.ts"; import { aaStore } from "./store.ts"; import { buildFinancialSummary } from "./ingestion-service.ts";
export async function createFinancialDataSession(consentId: string) { const consent = aaStore.getConsent(consentId); if (!consent || consent.status !== "ACTIVE") throw new SetuConsentNotActiveError(); const existing = aaStore.findSessionByConsent(consent.id); if (existing) return existing; const result = await getAccountAggregatorProvider().createDataSession({ consentId: consent.externalId, dataRange: { from: consent.from, to: consent.to }, format: "json" }); return aaStore.saveSession({ id: crypto.randomUUID(), externalId: result.id, consentId: consent.id, organisationId: consent.organisationId, status: result.status, from: consent.from, to: consent.to, fetchAttempts: 0, createdAt: new Date().toISOString() }); }
// Pull-based: calls Setu's GET /sessions/:id for the authoritative status (no dependency on inbound webhooks, so
// this works in local sandbox testing). When data is ready it normalizes + persists the financial summary.
export async function fetchSessionData(sessionId: string) {
  const session = aaStore.getSession(sessionId);
  if (!session) throw new SetuValidationError("Data session was not found.");
  const result = await getAccountAggregatorProvider().fetchFinancialData(session.externalId);
  aaStore.updateSession(session.id, { status: result.status, fetchAttempts: session.fetchAttempts + 1 });
  if (!["PARTIAL", "COMPLETED"].includes(result.status)) return { sessionId: result.sessionId, status: result.status, summary: undefined };
  const summary = buildFinancialSummary(session.organisationId, result.accounts as Record<string, unknown>[], session.from, session.to, result.status === "PARTIAL");
  aaStore.saveFinancialSummary(summary);
  const consent = aaStore.getConsent(session.consentId);
  if (consent) aaStore.updateConsent(consent.id, { completeness: summary.dataCompleteness });
  return { sessionId: result.sessionId, status: result.status, summary };
}
