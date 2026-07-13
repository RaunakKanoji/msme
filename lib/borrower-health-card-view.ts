import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 05-011 Borrower Health Card View — supportive, action-oriented presentation of the health card for the business.
// Exposes only approved explanations (no model internals, weights, or raw payloads).
export type BorrowerViewStatus = "Published" | "Needs review" | "Draft";
export type BorrowerView = { id: string; business_name: string; masked_reference: string; label: string; source_system: string; status: BorrowerViewStatus; headline: string; band: "Healthy" | "Watch" | "Stress"; overall_score: number; summary: string; strengths: string[]; focus_areas: string[]; next_actions: string[]; confidence: number; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; explanation: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type BorrowerViewSnapshot = { id: string; view_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; presentation_summary: string; redaction_summary: string; immutable: true };
export const BORROWER_VIEW_STATUSES: BorrowerViewStatus[] = ["Published", "Needs review", "Draft"];
let views: BorrowerView[] = [
  { id: "borrower_view_demo_001", business_name: "Saraswati Precision Works", masked_reference: "BHC-••••-3020", label: "Borrower health card", source_system: "Health score framework", status: "Published", headline: "Your business is in good financial health", band: "Healthy", overall_score: 71, summary: "Based on the bank, GST, and obligation information you shared, your business shows steady cash-flow and strong compliance. A couple of areas can be strengthened to improve your profile further.", strengths: ["Steady incoming payments over the last year", "GST returns and staff contributions filed on time"], focus_areas: ["A large share of sales comes from one customer", "Profit margins have tightened recently"], next_actions: ["Add a couple more regular buyers to reduce dependence on one customer", "Keep sharing fresh bank and GST data so your card stays current"], confidence: 82, source_id: "synthetic_health_card_2026_07", source_observed_at: "2026-07-13T10:20:00.000Z", freshness: "Current", completeness: 84, explanation: "This view explains your card in plain language. It is an analytical view to help you prepare — it is not a loan decision.", created_at: "2026-07-13T10:20:00.000Z", updated_at: "2026-07-13T10:20:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "borrower_view_demo_002", business_name: "Nair Textiles LLP", masked_reference: "BHC-••••-7188", label: "Borrower health card", source_system: "Health score framework", status: "Needs review", headline: "A few things need attention before your card is ready", band: "Stress", overall_score: 43, summary: "Some of your information is out of date, so we are not showing a final card yet. Refreshing your connections will give a clearer picture.", strengths: ["Compliance history is reasonable"], focus_areas: ["Some bank and GST data is out of date", "Recent months show tighter cash-flow"], next_actions: ["Refresh your Account Aggregator and GST connections", "Share the most recent months of activity"], confidence: 58, source_id: "synthetic_health_card_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 52, explanation: "This card is provisional while data is refreshed. It is not a loan decision.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const snapshots: BorrowerViewSnapshot[] = [
  { id: "borrower_view_snapshot_demo_001", view_id: "borrower_view_demo_001", source_id: "synthetic_health_card_2026_07", observed_at: "2026-07-13T10:20:00.000Z", freshness: "Current", completeness: 84, presentation_summary: "Plain-language summary with two strengths, two focus areas, and supportive next actions.", redaction_summary: "No weights, factor internals, or raw payloads are shown to the borrower.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getBorrowerHealthCardViews() { return { views, source_snapshots: snapshots }; }
export function getBorrowerHealthCardView(id: string) { return views.find((view) => view.id === id); }
export function createBorrowerHealthCardView(input: Pick<BorrowerView, "business_name" | "masked_reference" | "label" | "source_system">, actor: string) {
  const now = new Date().toISOString();
  const view: BorrowerView = { id: `borrower_view_${crypto.randomUUID()}`, ...input, status: "Draft", headline: "Your health card is being prepared", band: "Stress", overall_score: 0, summary: "We are preparing your health card from the information you shared.", strengths: [], focus_areas: [], next_actions: ["Connect your bank, GST, and other sources to build your card"], confidence: 0, source_id: "synthetic_borrower_view_request", source_observed_at: now, freshness: "Current", completeness: 0, explanation: "This card is being prepared and is not a loan decision.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  views = [view, ...views];
  writeAudit("borrower_health_card_view.created", view.id, actor);
  return view;
}
export function updateBorrowerHealthCardView(id: string, status: BorrowerViewStatus, actor: string) {
  const current = getBorrowerHealthCardView(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const updated: BorrowerView = { ...current, status, freshness: status === "Needs review" ? "Stale" : current.freshness, updated_at: now, updated_by: actor };
  views = views.map((view) => (view.id === id ? updated : view));
  writeAudit("borrower_health_card_view.updated", id, actor);
  return updated;
}
export function borrowerHealthCardViewAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
