import type { DataSourceMetadata, FinancialAccount, FinancialDataContext, FinancialSnapshot, FinancialTransaction, MockFinancialScenario } from "../../types.ts";
import { DEFAULT_MOCK_SCENARIO, MOCK_SCENARIOS } from "./mock-scenarios.ts";
// Deterministic, seeded generator. The same scenario always yields the same transactions, balances, and totals so
// the demo dataset is stable between refreshes and reproducible in tests. All amounts are whole INR.
function mulberry32(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const iso = (d: Date) => d.toISOString();
export type BuildMockOptions = { fetchedAt?: string; isFallback?: boolean; message?: string };
export function buildMockSnapshot(name: MockFinancialScenario = DEFAULT_MOCK_SCENARIO, context: FinancialDataContext = { businessId: "business_demo_001" }, options: BuildMockOptions = {}): FinancialSnapshot {
  const p = MOCK_SCENARIOS[name];
  const rand = mulberry32(p.seed);
  const jitter = (base: number, pct: number) => Math.round(base * (1 + (rand() - 0.5) * 2 * pct));
  const periodEnd = context.periodEnd ? new Date(context.periodEnd) : new Date(Date.UTC(2026, 5, 30));
  const start = new Date(Date.UTC(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth() - (p.months - 1), 1));
  const primary: FinancialAccount = { id: "acc_primary", maskedAccountNumber: "••••3311", institutionName: "HDFC Bank", accountType: "Current", currency: "INR", currentBalance: 0 };
  const secondary: FinancialAccount = { id: "acc_secondary", maskedAccountNumber: "••••9075", institutionName: "State Bank of India", accountType: "Savings", currency: "INR", currentBalance: p.secondaryBalance, availableBalance: p.secondaryBalance };
  const transactions: FinancialTransaction[] = [];
  let balance = p.openingBalance;
  let seq = 0;
  const monthRevenues: number[] = [];
  const monthExpenses: number[] = [];
  const monthEndBalances: number[] = [];
  const push = (day: number, monthDate: Date, description: string, amount: number, direction: "credit" | "debit", category: string) => {
    balance += direction === "credit" ? amount : -amount;
    transactions.push({ id: `mock_txn_${name}_${String(seq++).padStart(4, "0")}`, accountId: primary.id, occurredAt: iso(new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth(), day))), description, amount, direction, category, balanceAfterTransaction: balance });
  };
  for (let m = 0; m < p.months; m++) {
    const monthDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + m, 1));
    const growth = Math.pow(1 + p.revenueGrowth, m);
    const seasonal = 1 + p.seasonalAmplitude * Math.sin((2 * Math.PI * monthDate.getUTCMonth()) / 12);
    const revenueTarget = jitter(p.monthlyRevenueBase * growth * seasonal, 0.06);
    type Entry = { day: number; description: string; amount: number; direction: "credit" | "debit"; category: string };
    const entries: Entry[] = [];
    let monthRevenue = 0;
    for (const [day, frac, label] of [[5, 0.55, "Customer receipts (UPI/NEFT)"], [20, 0.45, "Customer receipts (invoice settlement)"]] as const) {
      const amount = Math.round(revenueTarget * frac);
      monthRevenue += amount;
      entries.push({ day, description: label, amount, direction: "credit", category: "revenue" });
    }
    const expenseTarget = Math.round(revenueTarget * p.expenseRatio);
    const gst = Math.round(monthRevenue * 0.05);
    const emi = p.monthlyEmi;
    const variable = Math.max(0, expenseTarget - (p.rent + p.utilities + gst + emi));
    const supplier = Math.round(variable * 0.6);
    const salary = Math.max(0, variable - supplier);
    let monthExpense = 0;
    for (const [day, label, amount, category] of [[8, "Supplier payment", supplier, "supplier-payment"], [1, "Staff salaries", salary, "salary"], [18, "GST remittance", gst, "gst"], [3, "Premises rent", p.rent, "rent"], [12, "Utilities (power/water)", p.utilities, "utilities"], [7, "Loan EMI", emi, "loan-emi"]] as const) {
      if (amount <= 0) continue;
      monthExpense += amount;
      entries.push({ day, description: label, amount, direction: "debit", category });
    }
    // Apply in chronological (within-month) order so balanceAfterTransaction forms a continuous chain.
    entries.sort((a, b) => a.day - b.day);
    for (const e of entries) push(e.day, monthDate, e.description, e.amount, e.direction, e.category);
    monthRevenues.push(monthRevenue);
    monthExpenses.push(monthExpense);
    monthEndBalances.push(balance);
  }
  primary.currentBalance = balance;
  primary.availableBalance = balance;
  const total = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
  const monthlyRevenue = Math.round(total(monthRevenues) / p.months);
  const monthlyExpenses = Math.round(total(monthExpenses) / p.months);
  const averageBalance = Math.round(total(monthEndBalances) / p.months);
  const metadata: DataSourceMetadata = { provider: "mock", status: "demo", isFallback: options.isFallback ?? false, isStale: false, fetchedAt: options.fetchedAt ?? new Date().toISOString(), effectiveFrom: iso(start), effectiveTo: iso(periodEnd), scenario: name, message: options.message ?? "Demonstration data — not real bank data." };
  return { businessId: context.businessId, businessName: context.businessName ?? p.businessName, periodStart: iso(start), periodEnd: iso(periodEnd), accounts: [primary, secondary], transactions, monthlyRevenue, monthlyExpenses, netCashFlow: monthlyRevenue - monthlyExpenses, averageBalance, liabilities: p.liabilities, debtObligations: p.monthlyEmi, metadata };
}
// Structural consistency check used by tests and callable defensively: per-account running balance is continuous
// and each account's currentBalance equals its last transaction balance. Returns [] when consistent.
export function checkSnapshotConsistency(snapshot: FinancialSnapshot): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const tx of snapshot.transactions) { if (ids.has(tx.id)) problems.push(`duplicate transaction id ${tx.id}`); ids.add(tx.id); if (tx.amount < 0) problems.push(`negative amount ${tx.id}`); }
  for (const account of snapshot.accounts) {
    const txns = snapshot.transactions.filter((t) => t.accountId === account.id).sort((a, b) => (a.occurredAt < b.occurredAt ? -1 : 1));
    if (!txns.length) continue;
    let running = (txns[0].balanceAfterTransaction ?? 0) - (txns[0].direction === "credit" ? txns[0].amount : -txns[0].amount);
    for (const tx of txns) { running += tx.direction === "credit" ? tx.amount : -tx.amount; if (tx.balanceAfterTransaction !== running) problems.push(`balance chain broke at ${tx.id}`); }
    if (account.currentBalance !== running) problems.push(`account ${account.id} currentBalance != last balance`);
  }
  if (snapshot.monthlyExpenses < 0 || snapshot.monthlyRevenue < 0) problems.push("negative monthly total");
  return problems;
}
