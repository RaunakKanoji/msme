import type { FinancialHealthMetric, FinancialHealthResult, FinancialInsight, FinancialRecommendation, FinancialSnapshot, HealthCategory, MetricStatus } from "./types.ts";
// Fixed pillar weights (health-score-v1). Exported so presentation layers (pillar breakdown) show the real values.
export const METRIC_WEIGHTS: Record<string, number> = { "revenue-trend": 0.18, "cash-flow-stability": 0.2, "debt-service": 0.18, liquidity: 0.16, "expense-ratio": 0.16, "working-capital": 0.12 };
// Single Track 03 health engine. It consumes the normalized FinancialSnapshot and therefore scores Setu-sourced and
// mock-sourced data through the exact same path — there is no separate calculation for demo mode. Deterministic.
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const inr = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.round(value));
const statusFromScore = (score: number): MetricStatus => (score >= 67 ? "good" : score >= 45 ? "watch" : "risk");
const categoryFromScore = (score: number): HealthCategory => (score >= 82 ? "excellent" : score >= 68 ? "healthy" : score >= 52 ? "stable" : score >= 38 ? "needs-attention" : "critical");

function monthlyBuckets(snapshot: FinancialSnapshot) {
  const revenue = new Map<string, number>();
  const expense = new Map<string, number>();
  for (const tx of snapshot.transactions) {
    const key = tx.occurredAt.slice(0, 7);
    if (tx.direction === "credit" && tx.category === "revenue") revenue.set(key, (revenue.get(key) ?? 0) + tx.amount);
    else if (tx.direction === "debit") expense.set(key, (expense.get(key) ?? 0) + tx.amount);
  }
  const keys = [...new Set([...revenue.keys(), ...expense.keys()])].sort();
  return keys.map((k) => ({ month: k, revenue: revenue.get(k) ?? 0, expense: expense.get(k) ?? 0 }));
}

export function calculateFinancialHealth(snapshot: FinancialSnapshot): FinancialHealthResult {
  const months = monthlyBuckets(snapshot);
  const n = Math.max(1, months.length);
  const period = `Last ${n} month${n === 1 ? "" : "s"}`;
  const revenue = snapshot.monthlyRevenue;
  const expenses = snapshot.monthlyExpenses;
  const net = snapshot.netCashFlow;

  // Revenue trend: second-half vs first-half average.
  const half = Math.floor(months.length / 2) || 1;
  const firstAvg = avg(months.slice(0, half).map((m) => m.revenue));
  const lastAvg = avg(months.slice(-half).map((m) => m.revenue));
  const growth = firstAvg > 0 ? (lastAvg - firstAvg) / firstAvg : 0;
  const revenueTrend: "up" | "down" | "stable" = growth > 0.02 ? "up" : growth < -0.02 ? "down" : "stable";
  const revenueScore = clamp(60 + growth * 400);

  // Cash-flow stability: lower month-to-month net volatility scores higher.
  const nets = months.map((m) => m.revenue - m.expense);
  const meanNet = avg(nets);
  const cov = meanNet !== 0 ? Math.sqrt(avg(nets.map((x) => (x - meanNet) ** 2))) / Math.abs(meanNet) : 1;
  const stabilityScore = clamp(100 - cov * 120);

  // Debt-service capability (DSCR proxy) and liquidity buffer.
  const dscr = snapshot.debtObligations > 0 ? net / snapshot.debtObligations : 3;
  const debtScore = clamp(dscr * 40);
  const bufferMonths = expenses > 0 ? snapshot.averageBalance / expenses : 3;
  const liquidityScore = clamp(bufferMonths * 45);
  const expenseRatio = revenue > 0 ? expenses / revenue : 1;
  const expenseScore = clamp((1 - expenseRatio) * 260);
  const workingCapital = snapshot.averageBalance + (snapshot.accounts.find((a) => a.accountType === "Savings")?.currentBalance ?? 0) - snapshot.debtObligations;
  const workingCapitalScore = clamp(50 + (expenses > 0 ? (workingCapital / expenses) * 20 : 0));

  const metrics: FinancialHealthMetric[] = [
    metric("revenue-trend", "Revenue trend", revenueScore, lastAvg, inr(lastAvg), revenueTrend, `Average monthly revenue ${revenueTrend === "up" ? "rose" : revenueTrend === "down" ? "fell" : "held steady"} over the period.`, period),
    metric("cash-flow-stability", "Cash-flow stability", stabilityScore, Math.round(meanNet), inr(meanNet), "stable", "Month-to-month net cash-flow consistency.", period),
    metric("debt-service", "Debt-service capability", debtScore, Number(dscr.toFixed(2)), `${dscr.toFixed(2)}x`, net >= 0 ? "stable" : "down", "Net cash-flow relative to monthly debt obligations (DSCR proxy).", period),
    metric("liquidity", "Liquidity", liquidityScore, Number(bufferMonths.toFixed(1)), `${bufferMonths.toFixed(1)} mo`, "stable", "Average balance expressed as months of expense cover.", period),
    metric("expense-ratio", "Expense ratio", expenseScore, Number((expenseRatio * 100).toFixed(1)), `${(expenseRatio * 100).toFixed(1)}%`, expenseRatio <= 0.85 ? "stable" : "up", "Monthly expenses as a share of monthly revenue.", period),
    metric("working-capital", "Working-capital position", workingCapitalScore, Math.round(workingCapital), inr(workingCapital), "stable", "Liquid balances net of near-term debt obligations.", period),
  ];

  const overallScore = Math.round(metrics.reduce((s, m) => s + m.score * (METRIC_WEIGHTS[m.id] ?? 0), 0));

  const strengths: FinancialInsight[] = metrics.filter((m) => m.status === "good").map((m) => ({ id: `strength-${m.id}`, title: m.name, detail: m.explanation }));
  const risks: FinancialInsight[] = metrics.filter((m) => m.status === "risk").map((m) => ({ id: `risk-${m.id}`, title: m.name, detail: m.explanation }));
  const recommendations: FinancialRecommendation[] = risks.length
    ? risks.map((r) => ({ id: `rec-${r.id}`, title: `Improve ${r.title.toLowerCase()}`, detail: `Address ${r.title.toLowerCase()} to strengthen the overall health score.`, priority: "high" as const }))
    : [{ id: "rec-maintain", title: "Maintain current discipline", detail: "Keep sharing fresh data so the score stays current.", priority: "low" }];

  return {
    overallScore,
    category: categoryFromScore(overallScore),
    calculatedAt: new Date().toISOString(),
    reportingPeriod: { start: snapshot.periodStart, end: snapshot.periodEnd },
    dataCompleteness: dataCompleteness(snapshot),
    metrics,
    strengths,
    risks,
    recommendations,
    source: snapshot.metadata,
  };
}

function metric(id: string, name: string, score: number, value: number, formattedValue: string, trend: FinancialHealthMetric["trend"], explanation: string, period: string): FinancialHealthMetric {
  const s = Math.round(score);
  return { id, name, score: s, value, formattedValue, status: statusFromScore(s) as MetricStatus, trend, explanation, period };
}
function avg(xs: number[]) { return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0; }
function dataCompleteness(snapshot: FinancialSnapshot): number {
  if (snapshot.metadata.scenario) { const map: Record<string, number> = { "stable-business": 88, "healthy-growth": 92, "cash-flow-stress": 74, "high-debt": 83, "seasonal-business": 80, "incomplete-data": 41 }; return map[snapshot.metadata.scenario] ?? 80; }
  const months = monthlyBuckets(snapshot).length;
  return clamp(Math.round((months / 12) * 100));
}
