// Shared formatting + presentation helpers for the card system. Pure and unit-tested.
import type { FinancialSnapshot } from "./types.ts";
export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.round(value));
}
// Compact Indian business notation: ₹14.5L / ₹1.2Cr — used on metric cards where space matters.
export function formatInrCompact(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `${sign}₹${trim(abs / 1_00_00_000)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${trim(abs / 1_00_000)}L`;
  if (abs >= 1_000) return `${sign}₹${trim(abs / 1_000)}K`;
  return `${sign}₹${Math.round(abs)}`;
}
function trim(n: number): string { const s = n.toFixed(1); return s.endsWith(".0") ? s.slice(0, -2) : s; }
export type MonthlyTrendPoint = { month: string; label: string; revenue: number; expenses: number };
// Month-by-month revenue/expense series from the normalized snapshot (for the trend card; no chart lib needed).
export function monthlyTrend(snapshot: FinancialSnapshot): MonthlyTrendPoint[] {
  const revenue = new Map<string, number>();
  const expenses = new Map<string, number>();
  for (const tx of snapshot.transactions) {
    const key = tx.occurredAt.slice(0, 7);
    if (tx.direction === "credit" && tx.category === "revenue") revenue.set(key, (revenue.get(key) ?? 0) + tx.amount);
    else if (tx.direction === "debit") expenses.set(key, (expenses.get(key) ?? 0) + tx.amount);
  }
  const keys = [...new Set([...revenue.keys(), ...expenses.keys()])].sort();
  return keys.map((key) => ({ month: key, label: monthLabel(key), revenue: revenue.get(key) ?? 0, expenses: expenses.get(key) ?? 0 }));
}
function monthLabel(key: string): string { const [y, m] = key.split("-").map(Number); return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" }); }
export function formatPeriod(startIso: string, endIso: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric", timeZone: "UTC" };
  return `${new Date(startIso).toLocaleDateString("en-IN", opts)} – ${new Date(endIso).toLocaleDateString("en-IN", opts)}`;
}
