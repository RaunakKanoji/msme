import { normalizeAccount } from "./normalization-service.ts";
import { calculateFinancialMetrics } from "./metrics-service.ts";
import { createDefaultRiskFeatureVector } from "./feature-service.ts";
import type { FinancialSummary, NormalizedFinancialTransaction } from "./types.ts";
// Pure (no provider / no `server-only`): turns flattened Setu FI accounts into the persisted financial summary.
// Dependency-injected `accounts` keeps this unit-testable without touching the HTTP provider.
export function buildFinancialSummary(organisationId: string, accounts: Record<string, unknown>[], from: string, to: string, partial = false): FinancialSummary {
  const seen = new Set<string>();
  const transactions: NormalizedFinancialTransaction[] = [];
  let connectedAccounts = 0;
  for (const raw of accounts) {
    try {
      const { transactions: normalized } = normalizeAccount(raw);
      connectedAccounts += 1;
      for (const tx of normalized) { if (!seen.has(tx.deduplicationHash)) { seen.add(tx.deduplicationHash); transactions.push(tx); } }
    } catch { /* account without a linked reference — skip, do not fail the whole ingestion */ }
  }
  const metrics = calculateFinancialMetrics(transactions, from, to, connectedAccounts, partial);
  const vector = createDefaultRiskFeatureVector(metrics);
  return { organisationId, connectedAccounts, dataCompleteness: metrics.dataCompleteness, sufficient: metrics.sufficient, metrics, features: vector?.features ?? null, featureSchemaVersion: vector?.schemaVersion ?? null, generatedAt: new Date().toISOString() };
}
