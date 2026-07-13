import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 05-001 Health Score Framework — deterministic multidimensional financial-health card. Aggregates the eight
// dimension scores (weighted) plus a data-sufficiency signal into an explainable overall band. No ML; versioned.
export type HealthBand = "Healthy" | "Watch" | "Stress";
export type HealthCardStatus = "Published" | "Needs review" | "Draft";
export type HealthDimension = { key: string; label: string; score: number; band: HealthBand; weight: number; confidence: number };
export type HealthCard = { id: string; business_name: string; masked_reference: string; label: string; source_system: string; status: HealthCardStatus; overall_score: number; band: HealthBand; confidence: number; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; explanation: string; framework_version: string; dimensions: HealthDimension[]; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type HealthCardSnapshot = { id: string; card_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; scoring_summary: string; weighting_summary: string; immutable: true };
export const HEALTH_CARD_STATUSES: HealthCardStatus[] = ["Published", "Needs review", "Draft"];
export function bandFor(score: number): HealthBand { return score >= 70 ? "Healthy" : score >= 45 ? "Watch" : "Stress"; }
let cards: HealthCard[] = [
  { id: "health_card_demo_001", business_name: "Saraswati Precision Works", masked_reference: "HC-••••-2048", label: "Overall financial health", source_system: "Feature snapshot (aa-risk-features-v1)", status: "Published", overall_score: 71, band: "Healthy", confidence: 82, source_id: "synthetic_health_card_2026_07", source_observed_at: "2026-07-13T10:20:00.000Z", freshness: "Current", completeness: 84, explanation: "The overall band is a weighted blend of eight dimensions. Cash-flow and compliance are strong; customer concentration and profitability temper the score. This is an explainable analytical view, not a credit decision.", framework_version: "health-score-v1", dimensions: [
    { key: "cashflow", label: "Cash-flow health", score: 78, band: "Healthy", weight: 0.2, confidence: 88 },
    { key: "liquidity", label: "Liquidity", score: 69, band: "Watch", weight: 0.15, confidence: 80 },
    { key: "revenue_stability", label: "Revenue stability", score: 74, band: "Healthy", weight: 0.15, confidence: 78 },
    { key: "profitability", label: "Profitability", score: 58, band: "Watch", weight: 0.1, confidence: 66 },
    { key: "compliance", label: "Compliance", score: 83, band: "Healthy", weight: 0.15, confidence: 90 },
    { key: "repayment_behaviour", label: "Repayment behaviour", score: 72, band: "Healthy", weight: 0.1, confidence: 74 },
    { key: "customer_concentration", label: "Customer concentration", score: 51, band: "Watch", weight: 0.1, confidence: 70 },
    { key: "digital_footprint", label: "Digital footprint", score: 66, band: "Watch", weight: 0.05, confidence: 72 },
  ], created_at: "2026-07-13T10:20:00.000Z", updated_at: "2026-07-13T10:20:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "health_card_demo_002", business_name: "Nair Textiles LLP", masked_reference: "HC-••••-7731", label: "Overall financial health", source_system: "Feature snapshot (aa-risk-features-v1)", status: "Needs review", overall_score: 43, band: "Stress", confidence: 58, source_id: "synthetic_health_card_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 52, explanation: "Two dimensions rely on stale sources and the data-sufficiency signal is low, so the card is held for analyst review before publication.", framework_version: "health-score-v1", dimensions: [
    { key: "cashflow", label: "Cash-flow health", score: 47, band: "Watch", weight: 0.2, confidence: 60 },
    { key: "liquidity", label: "Liquidity", score: 38, band: "Stress", weight: 0.15, confidence: 55 },
    { key: "revenue_stability", label: "Revenue stability", score: 41, band: "Stress", weight: 0.15, confidence: 50 },
    { key: "profitability", label: "Profitability", score: 44, band: "Stress", weight: 0.1, confidence: 52 },
    { key: "compliance", label: "Compliance", score: 62, band: "Watch", weight: 0.15, confidence: 68 },
    { key: "repayment_behaviour", label: "Repayment behaviour", score: 40, band: "Stress", weight: 0.1, confidence: 48 },
    { key: "customer_concentration", label: "Customer concentration", score: 35, band: "Stress", weight: 0.1, confidence: 45 },
    { key: "digital_footprint", label: "Digital footprint", score: 50, band: "Watch", weight: 0.05, confidence: 58 },
  ], created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: HealthCardSnapshot[] = [
  { id: "health_card_snapshot_demo_001", card_id: "health_card_demo_001", source_id: "synthetic_health_card_2026_07", observed_at: "2026-07-13T10:20:00.000Z", freshness: "Current", completeness: 84, scoring_summary: "Eight dimensions scored deterministically and blended by fixed weights into an overall band of Healthy (71/100).", weighting_summary: "Framework version health-score-v1 records each dimension weight and confidence; inputs are immutable feature snapshots.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getHealthScoreFramework() { return { cards, source_snapshots: snapshots }; }
export function getHealthCard(id: string) { return cards.find((card) => card.id === id); }
export function createHealthCard(input: Pick<HealthCard, "business_name" | "masked_reference" | "label" | "source_system">, actor: string) {
  const now = new Date().toISOString();
  const card: HealthCard = { id: `health_card_${crypto.randomUUID()}`, ...input, status: "Draft", overall_score: 0, band: "Stress", confidence: 0, source_id: "synthetic_health_card_request", source_observed_at: now, freshness: "Current", completeness: 0, explanation: "Publish once dimension scores and the data-sufficiency signal are available. Scores are explainable and are not a credit decision.", framework_version: "health-score-v1", dimensions: [], created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  cards = [card, ...cards];
  writeAudit("health_score_framework.created", card.id, actor);
  return card;
}
export function updateHealthCard(id: string, status: HealthCardStatus, actor: string) {
  const current = getHealthCard(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const updated: HealthCard = { ...current, status, freshness: status === "Needs review" ? "Stale" : current.freshness, updated_at: now, updated_by: actor };
  cards = cards.map((card) => (card.id === id ? updated : card));
  writeAudit("health_score_framework.updated", id, actor);
  return updated;
}
export function healthScoreFrameworkAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
