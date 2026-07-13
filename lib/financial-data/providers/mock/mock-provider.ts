import type { FinancialDataProvider } from "../../provider.ts";
import { ok } from "../../provider-result.ts";
import type { FinancialAccount, FinancialDataContext, FinancialSnapshot, FinancialTransaction, MockFinancialScenario, ProviderHealthResult, ProviderResult } from "../../types.ts";
import { buildMockSnapshot, type BuildMockOptions } from "./mock-data.ts";
import { DEFAULT_MOCK_SCENARIO } from "./mock-scenarios.ts";
// Deterministic mock provider. Pure (no server-only, no I/O) so it is unit-testable and always available.
export class MockFinancialProvider implements FinancialDataProvider {
  constructor(private scenario: MockFinancialScenario = DEFAULT_MOCK_SCENARIO, private options: BuildMockOptions = {}) {}
  getProviderName() { return "mock"; }
  async checkHealth(): Promise<ProviderHealthResult> { return { configured: true, reachable: true, message: "Deterministic demonstration data." }; }
  private snapshot(context: FinancialDataContext): FinancialSnapshot { return buildMockSnapshot(context.scenario ?? this.scenario, context, this.options); }
  async getFinancialSnapshot(context: FinancialDataContext): Promise<ProviderResult<FinancialSnapshot>> { const snap = this.snapshot(context); return ok(snap, snap.metadata); }
  async getAccounts(context: FinancialDataContext): Promise<ProviderResult<FinancialAccount[]>> { const snap = this.snapshot(context); return ok(snap.accounts, snap.metadata); }
  async getTransactions(context: FinancialDataContext): Promise<ProviderResult<FinancialTransaction[]>> { const snap = this.snapshot(context); return ok(snap.transactions, snap.metadata); }
}
