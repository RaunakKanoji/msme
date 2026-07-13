import type { FinancialSnapshot } from "../financial-data/types.ts";
// MSME segment routing (Section 12). Different segments use different scorecards; NTC enterprises are never
// penalized merely for having no commercial bureau history.
export type MsmeSegment = "NTC" | "NTB" | "EXISTING_TO_BANK" | "THIN_FILE";
export type SegmentContext = { hasBureauHistory: boolean; isExistingToBank: boolean; monthsOfBankData: number; transactionCount: number };
export function contextFromSnapshot(snapshot: FinancialSnapshot, flags: { hasBureauHistory?: boolean; isExistingToBank?: boolean } = {}): SegmentContext {
  const months = new Set(snapshot.transactions.map((t) => t.occurredAt.slice(0, 7))).size;
  return { hasBureauHistory: flags.hasBureauHistory ?? false, isExistingToBank: flags.isExistingToBank ?? false, monthsOfBankData: months, transactionCount: snapshot.transactions.length };
}
export function selectSegment(context: SegmentContext): MsmeSegment {
  if (context.monthsOfBankData < 6 || context.transactionCount < 20) return "THIN_FILE";
  if (context.isExistingToBank) return "EXISTING_TO_BANK";
  if (!context.hasBureauHistory) return "NTC";
  return "NTB";
}
