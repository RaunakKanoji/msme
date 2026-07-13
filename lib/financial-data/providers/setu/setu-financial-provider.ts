import "server-only";
import type { FinancialDataProvider } from "../../provider.ts";
import { err } from "../../provider-result.ts";
import type { FinancialAccount, FinancialDataContext, FinancialSnapshot, FinancialTransaction, ProviderHealthResult, ProviderResult } from "../../types.ts";
import { getSetuConfig } from "../../../../server/account-aggregator/providers/setu/setu-config.ts";
// Server-only Setu adapter. Wraps the existing account-aggregator Setu integration and produces the SAME normalized
// FinancialSnapshot as the mock provider. Live per-business FI retrieval requires FIU onboarding + an active consent
// + a provisioned store; until those exist this reports the accurate provider state so the service falls back.
export class SetuFinancialProvider implements FinancialDataProvider {
  getProviderName() { return "setu"; }
  private configured() { const c = getSetuConfig(); return c.mode === "setu" && Boolean(c.clientId && c.clientSecret && c.productInstanceId); }
  async checkHealth(): Promise<ProviderHealthResult> {
    const configured = this.configured();
    return { configured, reachable: false, message: configured ? "Setu is configured; live financial retrieval is not yet reachable in this environment." : "Setu is not configured; using fallback data." };
  }
  async getFinancialSnapshot(_context: FinancialDataContext): Promise<ProviderResult<FinancialSnapshot>> {
    if (!this.configured()) return err("PROVIDER_NOT_CONFIGURED", "Setu is not configured.");
    // Live consented per-business FI is not retrievable in this environment yet; report unavailable to trigger fallback.
    return err("PROVIDER_UNAVAILABLE", "Live financial data is temporarily unavailable.");
  }
  async getAccounts(context: FinancialDataContext): Promise<ProviderResult<FinancialAccount[]>> { const r = await this.getFinancialSnapshot(context); return r.ok ? { ok: true, data: r.data.accounts, source: r.source } : r; }
  async getTransactions(context: FinancialDataContext): Promise<ProviderResult<FinancialTransaction[]>> { const r = await this.getFinancialSnapshot(context); return r.ok ? { ok: true, data: r.data.transactions, source: r.source } : r; }
}
