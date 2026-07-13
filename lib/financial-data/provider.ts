import type { FinancialAccount, FinancialDataContext, FinancialSnapshot, FinancialTransaction, ProviderHealthResult, ProviderResult } from "./types.ts";
// A financial-data provider. Setu and mock both implement this; the service layer picks between them and never
// leaks provider-specific shapes upward.
export interface FinancialDataProvider {
  getProviderName(): string;
  checkHealth(): Promise<ProviderHealthResult>;
  getAccounts(context: FinancialDataContext): Promise<ProviderResult<FinancialAccount[]>>;
  getTransactions(context: FinancialDataContext): Promise<ProviderResult<FinancialTransaction[]>>;
  getFinancialSnapshot(context: FinancialDataContext): Promise<ProviderResult<FinancialSnapshot>>;
}
