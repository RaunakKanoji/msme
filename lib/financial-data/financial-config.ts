import type { MockFinancialScenario, ProviderMode } from "./types.ts";
// Env-driven configuration for the financial-data layer. Pure (no server-only) so it can be unit-tested.
const MODES: ProviderMode[] = ["auto", "setu", "mock"];
const SCENARIOS: MockFinancialScenario[] = ["healthy-growth", "stable-business", "cash-flow-stress", "high-debt", "seasonal-business", "incomplete-data"];
export type FinancialConfig = { mode: ProviderMode; fallbackEnabled: boolean; scenario: MockFinancialScenario };
export function getFinancialConfig(env: Record<string, string | undefined> = process.env): FinancialConfig {
  const mode = MODES.includes(env.FINANCIAL_DATA_PROVIDER as ProviderMode) ? (env.FINANCIAL_DATA_PROVIDER as ProviderMode) : "auto";
  const fallbackEnabled = env.FINANCIAL_DATA_FALLBACK_ENABLED !== "false";
  const scenario = SCENARIOS.includes(env.FINANCIAL_DATA_MOCK_SCENARIO as MockFinancialScenario) ? (env.FINANCIAL_DATA_MOCK_SCENARIO as MockFinancialScenario) : "stable-business";
  return { mode, fallbackEnabled, scenario };
}
// Production guard: never let an untrusted query pick a scenario in production (Section 25).
export function scenarioSelectionAllowed(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV !== "production" || env.FINANCIAL_DATA_ALLOW_SCENARIO_OVERRIDE === "true";
}
