import type { MockFinancialScenario } from "../../types.ts";
// Deterministic scenario parameters. A fixed seed per scenario makes every generated dataset stable across refreshes.
export type ScenarioParams = {
  seed: number;
  businessName: string;
  openingBalance: number;      // primary current-account opening balance (INR)
  secondaryBalance: number;    // savings/reserve account balance (INR)
  monthlyRevenueBase: number;  // baseline monthly revenue (INR)
  revenueGrowth: number;       // per-month multiplicative growth
  seasonalAmplitude: number;   // 0..1 festive swing
  expenseRatio: number;        // total monthly expenses as a fraction of revenue
  rent: number;                // fixed monthly rent (INR)
  utilities: number;           // fixed monthly utilities (INR)
  monthlyEmi: number;          // monthly debt EMI (INR)
  liabilities: number;         // outstanding debt principal (INR)
  months: number;              // history length (12 normally)
  completeness: number;        // 0..100 data-completeness signal
};
export const DEFAULT_MOCK_SCENARIO: MockFinancialScenario = "stable-business";
export const MOCK_SCENARIOS: Record<MockFinancialScenario, ScenarioParams> = {
  "stable-business": { seed: 1010, businessName: "Saraswati Precision Works", openingBalance: 1250000, secondaryBalance: 600000, monthlyRevenueBase: 1450000, revenueGrowth: 0.004, seasonalAmplitude: 0.08, expenseRatio: 0.765, rent: 90000, utilities: 35000, monthlyEmi: 120000, liabilities: 4200000, months: 12, completeness: 88 },
  "healthy-growth": { seed: 2020, businessName: "Verdant Agro Exports", openingBalance: 1800000, secondaryBalance: 1200000, monthlyRevenueBase: 1600000, revenueGrowth: 0.02, seasonalAmplitude: 0.1, expenseRatio: 0.68, rent: 110000, utilities: 40000, monthlyEmi: 90000, liabilities: 2600000, months: 12, completeness: 92 },
  "cash-flow-stress": { seed: 3030, businessName: "Coastal Textiles", openingBalance: 350000, secondaryBalance: 90000, monthlyRevenueBase: 1200000, revenueGrowth: -0.006, seasonalAmplitude: 0.14, expenseRatio: 0.95, rent: 130000, utilities: 45000, monthlyEmi: 160000, liabilities: 5200000, months: 12, completeness: 74 },
  "high-debt": { seed: 4040, businessName: "Meridian Fabricators", openingBalance: 700000, secondaryBalance: 200000, monthlyRevenueBase: 1500000, revenueGrowth: 0.002, seasonalAmplitude: 0.07, expenseRatio: 0.82, rent: 140000, utilities: 50000, monthlyEmi: 320000, liabilities: 9800000, months: 12, completeness: 83 },
  "seasonal-business": { seed: 5050, businessName: "Himalaya Handlooms", openingBalance: 900000, secondaryBalance: 500000, monthlyRevenueBase: 1300000, revenueGrowth: 0.003, seasonalAmplitude: 0.4, expenseRatio: 0.78, rent: 85000, utilities: 30000, monthlyEmi: 110000, liabilities: 3600000, months: 12, completeness: 80 },
  "incomplete-data": { seed: 6060, businessName: "Nascent Ventures", openingBalance: 500000, secondaryBalance: 150000, monthlyRevenueBase: 900000, revenueGrowth: 0.005, seasonalAmplitude: 0.1, expenseRatio: 0.8, rent: 60000, utilities: 25000, monthlyEmi: 70000, liabilities: 1800000, months: 4, completeness: 41 },
};
