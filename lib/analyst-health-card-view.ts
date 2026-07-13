import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 05-012 Analyst Health Card View — detailed, reviewable presentation of the health card for bank analysts, with
// per-dimension scores, confidence, freshness, follow-ups, and an explicit review status. Not a credit decision.
export type AnalystViewStatus = "Published" | "Needs review" | "Draft";
export type AnalystDimensionRow = { label: string; score: number; band: "Healthy" | "Watch" | "Stress"; confidence: number; freshness: "Current" | "Stale" };
export type AnalystView = { id: string; business_name: string; masked_reference: string; label: string; source_system: string; status: AnalystViewStatus; overall_score: number; band: "Healthy" | "Watch" | "Stress"; review_status: "Ready" | "Needs review"; dimensions: AnalystDimensionRow[]; follow_ups: string[]; confidence: number; data_sufficiency: number; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; explanation: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type AnalystViewSnapshot = { id: string; view_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; review_summary: string; evidence_summary: string; immutable: true };
export const ANALYST_VIEW_STATUSES: AnalystViewStatus[] = ["Published", "Needs review", "Draft"];
let views: AnalystView[] = [
  { id: "analyst_view_demo_001", business_name: "Saraswati Precision Works", masked_reference: "AHC-••••-4030", label: "Analyst health card", source_system: "Health score framework", status: "Published", overall_score: 71, band: "Healthy", review_status: "Ready", dimensions: [
    { label: "Cash-flow health", score: 78, band: "Healthy", confidence: 88, freshness: "Current" },
    { label: "Liquidity", score: 69, band: "Watch", confidence: 80, freshness: "Current" },
    { label: "Revenue stability", score: 74, band: "Healthy", confidence: 78, freshness: "Current" },
    { label: "Profitability", score: 58, band: "Watch", confidence: 66, freshness: "Current" },
    { label: "Compliance", score: 83, band: "Healthy", confidence: 90, freshness: "Current" },
    { label: "Repayment behaviour", score: 72, band: "Healthy", confidence: 74, freshness: "Current" },
    { label: "Customer concentration", score: 51, band: "Watch", confidence: 70, freshness: "Current" },
    { label: "Digital footprint", score: 66, band: "Watch", confidence: 72, freshness: "Current" },
  ], follow_ups: ["Confirm customer-concentration mitigation before relying on revenue stability", "Watch profitability margin trend on the next data refresh"], confidence: 82, data_sufficiency: 84, source_id: "synthetic_health_card_2026_07", source_observed_at: "2026-07-13T10:20:00.000Z", freshness: "Current", completeness: 84, explanation: "All dimensions are current with adequate data sufficiency; the card is ready for assisted review. This is an analytical view, not a credit decision.", created_at: "2026-07-13T10:20:00.000Z", updated_at: "2026-07-13T10:20:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "analyst_view_demo_002", business_name: "Nair Textiles LLP", masked_reference: "AHC-••••-9261", label: "Analyst health card", source_system: "Health score framework", status: "Needs review", overall_score: 43, band: "Stress", review_status: "Needs review", dimensions: [
    { label: "Cash-flow health", score: 47, band: "Watch", confidence: 60, freshness: "Stale" },
    { label: "Liquidity", score: 38, band: "Stress", confidence: 55, freshness: "Stale" },
    { label: "Revenue stability", score: 41, band: "Stress", confidence: 50, freshness: "Stale" },
    { label: "Compliance", score: 62, band: "Watch", confidence: 68, freshness: "Stale" },
  ], follow_ups: ["Request refreshed AA and GST data before publication", "Re-run data-quality rules once sources are current"], confidence: 58, data_sufficiency: 52, source_id: "synthetic_health_card_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 52, explanation: "Multiple dimensions rely on stale sources and data sufficiency is low; hold for review before publishing.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: AnalystViewSnapshot[] = [
  { id: "analyst_view_snapshot_demo_001", view_id: "analyst_view_demo_001", source_id: "synthetic_health_card_2026_07", observed_at: "2026-07-13T10:20:00.000Z", freshness: "Current", completeness: 84, review_summary: "Eight dimensions presented with score, band, confidence, and freshness plus two follow-ups.", evidence_summary: "Each dimension links to its immutable source snapshot; overall band is a fixed-weight blend.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getAnalystHealthCardViews() { return { views, source_snapshots: snapshots }; }
export function getAnalystHealthCardView(id: string) { return views.find((view) => view.id === id); }
export function createAnalystHealthCardView(input: Pick<AnalystView, "business_name" | "masked_reference" | "label" | "source_system">, actor: string) {
  const now = new Date().toISOString();
  const view: AnalystView = { id: `analyst_view_${crypto.randomUUID()}`, ...input, status: "Draft", overall_score: 0, band: "Stress", review_status: "Needs review", dimensions: [], follow_ups: ["Publish dimension scores before this card can be reviewed"], confidence: 0, data_sufficiency: 0, source_id: "synthetic_analyst_view_request", source_observed_at: now, freshness: "Current", completeness: 0, explanation: "This analyst view is a draft until dimension scores and data sufficiency are available. It is not a credit decision.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  views = [view, ...views];
  writeAudit("analyst_health_card_view.created", view.id, actor);
  return view;
}
export function updateAnalystHealthCardView(id: string, status: AnalystViewStatus, actor: string) {
  const current = getAnalystHealthCardView(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const updated: AnalystView = { ...current, status, review_status: status === "Published" ? "Ready" : "Needs review", freshness: status === "Needs review" ? "Stale" : current.freshness, updated_at: now, updated_by: actor };
  views = views.map((view) => (view.id === id ? updated : view));
  writeAudit("analyst_health_card_view.updated", id, actor);
  return updated;
}
export function analystHealthCardViewAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
