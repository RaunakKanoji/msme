import type { FinancialSnapshot } from "../financial-data/types.ts";
import { pdBand, PD_BAND_CONFIG, type PdBandName } from "./risk-bands.ts";
import { contextFromSnapshot, selectSegment, type MsmeSegment } from "./segments.ts";
// 12-month probability-of-default — BOOTSTRAP SCORECARD (Section 11.2 Stage 1). A deterministic, points-based,
// scorecard-style model used to initialize the platform before a trained/calibrated ML champion exists. It is
// versioned, monotonic (worse cash-flow, coverage, or buffers can only raise PD), and NTC-safe: absent bureau
// history contributes zero points rather than a penalty. It is NOT a trained model and NOT a bureau score.
export const PD_MODEL_VERSION = "pd-bootstrap-scorecard-v1.0.0";
export const DEFAULT_DEFINITION_VERSION = "default-90dpd-v1";
export type PdFactor = { code: string; points: number; detail: string };
export type PdAssessment = {
  probabilityOfDefault12M: number;
  pdBand: PdBandName;
  segment: MsmeSegment;
  status: "FINAL" | "PROVISIONAL";
  modelVersion: string;
  definitionVersion: string;
  bandConfigVersion: string;
  factors: PdFactor[];
  generatedAt: string;
};
// Points → PD via logistic transform anchored so 0 points ≈ 3.5% baseline and each +30 points doubles the odds
// (points-to-double-the-odds convention, Section 11.3).
const BASELINE_ODDS = 0.035 / (1 - 0.035);
const PDO = 30;
export function pointsToPd(points: number): number {
  const odds = BASELINE_ODDS * Math.pow(2, points / PDO);
  return Math.min(0.99, Math.max(0.001, odds / (1 + odds)));
}
export function assessDefaultRisk(snapshot: FinancialSnapshot, flags: { hasBureauHistory?: boolean; isExistingToBank?: boolean } = {}): PdAssessment {
  const context = contextFromSnapshot(snapshot, flags);
  const segment = selectSegment(context);
  const factors: PdFactor[] = [];
  const add = (code: string, points: number, detail: string) => { if (points !== 0) factors.push({ code, points, detail }); };
  const revenue = snapshot.monthlyRevenue;
  // Net cash-flow margin (monotonic: thinner margin → more points → higher PD).
  const margin = revenue > 0 ? snapshot.netCashFlow / revenue : -1;
  if (margin < 0) add("NEGATIVE_NET_CASHFLOW", 34, "Average monthly outflows exceed inflows.");
  else if (margin < 0.05) add("THIN_CASHFLOW_MARGIN", 20, "Net cash-flow margin is under 5% of revenue.");
  else if (margin < 0.15) add("MODERATE_CASHFLOW_MARGIN", 8, "Net cash-flow margin is under 15% of revenue.");
  else add("STRONG_CASHFLOW_MARGIN", -10, "Healthy net cash-flow margin above 15% of revenue.");
  // Debt-service coverage proxy (monotonic).
  const dscr = snapshot.debtObligations > 0 ? snapshot.netCashFlow / snapshot.debtObligations : 3;
  if (dscr < 1) add("DSCR_BELOW_1", 30, "Net cash flow does not cover monthly debt obligations.");
  else if (dscr < 1.5) add("DSCR_TIGHT", 14, "Debt-service coverage is under 1.5x.");
  else add("DSCR_COMFORTABLE", -8, "Debt-service coverage of 1.5x or better.");
  // Liquidity buffer in months of expenses (monotonic).
  const buffer = snapshot.monthlyExpenses > 0 ? snapshot.averageBalance / snapshot.monthlyExpenses : 0;
  if (buffer < 0.25) add("MINIMAL_LIQUIDITY_BUFFER", 22, "Average balances cover under a week of expenses.");
  else if (buffer < 1) add("LOW_LIQUIDITY_BUFFER", 10, "Average balances cover under one month of expenses.");
  else add("ADEQUATE_LIQUIDITY_BUFFER", -6, "Average balances cover a month or more of expenses.");
  // Leverage: outstanding liabilities relative to annualized revenue (monotonic).
  const leverage = revenue > 0 ? snapshot.liabilities / (revenue * 12) : 1;
  if (leverage > 0.6) add("HIGH_LEVERAGE", 16, "Outstanding debt exceeds 60% of annual revenue.");
  else if (leverage > 0.35) add("MODERATE_LEVERAGE", 6, "Outstanding debt is between 35% and 60% of annual revenue.");
  // Data sufficiency: shorter history widens uncertainty (points, never a delinquency signal).
  if (context.monthsOfBankData < 6) add("SHORT_DATA_HISTORY", 12, "Fewer than six months of bank history are available.");
  else if (context.monthsOfBankData < 12) add("PARTIAL_DATA_HISTORY", 5, "Fewer than twelve months of bank history are available.");
  // NTC: absence of bureau history is explicitly neutral (Section 12.1) — recorded for transparency, zero points.
  if (!context.hasBureauHistory) factors.push({ code: "NO_BUREAU_HISTORY_NEUTRAL", points: 0, detail: "No commercial bureau history; treated as neutral for NTC assessment." });
  const totalPoints = factors.reduce((sum, f) => sum + f.points, 0);
  const pd = pointsToPd(totalPoints);
  return {
    probabilityOfDefault12M: Number(pd.toFixed(4)),
    pdBand: pdBand(pd),
    segment,
    status: segment === "THIN_FILE" ? "PROVISIONAL" : "FINAL",
    modelVersion: PD_MODEL_VERSION,
    definitionVersion: DEFAULT_DEFINITION_VERSION,
    bandConfigVersion: PD_BAND_CONFIG.version,
    factors: factors.sort((a, b) => b.points - a.points),
    generatedAt: new Date().toISOString(),
  };
}
