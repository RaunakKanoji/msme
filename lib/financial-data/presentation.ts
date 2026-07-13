import type { FinancialHealthMetric, MetricStatus } from "./types.ts";
// Presentation mapping shared by Overview and Financial Health: engine statuses → semantic card statuses. The
// semantic direction is decided here (not "up is always good") and passed to MetricCard as typed props.
export type CardStatus = "positive" | "warning" | "negative" | "neutral";
export function cardStatus(status: MetricStatus): CardStatus {
  return status === "good" ? "positive" : status === "watch" ? "warning" : status === "risk" ? "negative" : "neutral";
}
export function findMetric(metrics: FinancialHealthMetric[], id: string): FinancialHealthMetric | undefined {
  return metrics.find((metric) => metric.id === id);
}
