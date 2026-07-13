// Application-owned normalized financial-data domain model. Track 03 calculations and all UI consume THESE types,
// never raw Setu responses. Both the Setu adapter and the mock provider produce the same shapes.
export type DataSourceType = "setu" | "database-cache" | "mock" | "manual";
export type DataSourceStatus = "live" | "cached" | "demo" | "manual";
export type MockFinancialScenario = "healthy-growth" | "stable-business" | "cash-flow-stress" | "high-debt" | "seasonal-business" | "incomplete-data";
export type ProviderMode = "auto" | "setu" | "mock";

export type FinancialProviderErrorCode =
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_AUTH_FAILED"
  | "PROVIDER_RATE_LIMITED"
  | "INVALID_PROVIDER_RESPONSE"
  | "PROVIDER_NOT_CONFIGURED"
  | "CONSENT_REQUIRED"
  | "UNKNOWN_PROVIDER_ERROR";
export type FinancialProviderError = { code: FinancialProviderErrorCode; message: string };

export interface DataSourceMetadata {
  provider: DataSourceType;
  status: DataSourceStatus;
  isFallback: boolean;
  isStale: boolean;
  fetchedAt: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  scenario?: MockFinancialScenario;
  message?: string;
}

export interface FinancialAccount {
  id: string;
  maskedAccountNumber: string;
  institutionName: string;
  accountType: string;
  currency: "INR";
  currentBalance: number;
  availableBalance?: number;
}

export interface FinancialTransaction {
  id: string;
  accountId: string;
  occurredAt: string;
  description: string;
  amount: number;
  direction: "credit" | "debit";
  category: string;
  balanceAfterTransaction?: number;
}

export interface FinancialSnapshot {
  businessId: string;
  businessName: string;
  periodStart: string;
  periodEnd: string;
  accounts: FinancialAccount[];
  transactions: FinancialTransaction[];
  monthlyRevenue: number;
  monthlyExpenses: number;
  netCashFlow: number;
  averageBalance: number;
  liabilities: number;
  debtObligations: number;
  metadata: DataSourceMetadata;
}

export interface FinancialDataContext {
  businessId: string;
  businessName?: string;
  periodStart?: string;
  periodEnd?: string;
  refresh?: boolean;
  scenario?: MockFinancialScenario;
}

export type ProviderResult<T> =
  | { ok: true; data: T; source: DataSourceMetadata }
  | { ok: false; error: FinancialProviderError };

export interface ProviderHealthResult {
  configured: boolean;
  reachable: boolean;
  message?: string;
  lastSyncAt?: string;
}

// Track 03 financial-health result (Section 29). The engine produces this from a FinancialSnapshot.
export type HealthCategory = "excellent" | "healthy" | "stable" | "needs-attention" | "critical";
export type MetricStatus = "good" | "watch" | "risk" | "unavailable";
export interface FinancialHealthMetric {
  id: string;
  name: string;
  score: number;
  value: number;
  formattedValue: string;
  status: MetricStatus;
  trend?: "up" | "down" | "stable";
  explanation: string;
  period: string;
}
export interface FinancialInsight { id: string; title: string; detail: string }
export interface FinancialRecommendation { id: string; title: string; detail: string; priority: "high" | "medium" | "low" }
export interface FinancialHealthResult {
  overallScore: number;
  category: HealthCategory;
  calculatedAt: string;
  reportingPeriod: { start: string; end: string };
  dataCompleteness: number;
  metrics: FinancialHealthMetric[];
  strengths: FinancialInsight[];
  risks: FinancialInsight[];
  recommendations: FinancialRecommendation[];
  source: DataSourceMetadata;
}

export function statusForProvider(provider: DataSourceType): DataSourceStatus {
  return provider === "setu" ? "live" : provider === "database-cache" ? "cached" : provider === "manual" ? "manual" : "demo";
}
