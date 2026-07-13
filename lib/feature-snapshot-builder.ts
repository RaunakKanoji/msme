import { apiError, getActor, isAllowedRole, traceId } from "./problem-statement-fit.ts";
export { apiError, getActor, isAllowedRole, traceId };
// 04-010 Feature Snapshot Builder — assembles immutable, versioned feature snapshots from canonical sources for
// scoring. Snapshots are the immutable inputs to Financial Health and default-risk models; raw payloads are excluded.
export type FeatureSnapshotStatus = "Built" | "Pending" | "Stale";
export type FeatureSnapshotRecord = { id: string; label: string; source_system: string; masked_reference: string; purpose: string; schema_version: string; status: FeatureSnapshotStatus; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; feature_count: number; explanation: string; last_built_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type FeatureSnapshotEvidence = { id: string; snapshot_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; feature_summary: string; lineage_summary: string; immutable: true };
export const FEATURE_SNAPSHOT_STATUSES: FeatureSnapshotStatus[] = ["Built", "Pending", "Stale"];
let snapshots: FeatureSnapshotRecord[] = [
  { id: "feature_snapshot_demo_001", label: "Financial-health feature vector", source_system: "Canonical bank + GST + obligations", masked_reference: "FS-FH-••••-1190", purpose: "Financial Health Card scoring", schema_version: "aa-risk-features-v1", status: "Built", source_id: "synthetic_feature_build_2026_07", source_observed_at: "2026-07-13T10:15:00.000Z", freshness: "Current", completeness: 88, feature_count: 16, explanation: "Sixteen versioned features were assembled from reconciled canonical sources with per-feature lineage. The snapshot is immutable and safe to score against.", last_built_at: "2026-07-13T10:15:00.000Z", created_at: "2026-07-13T10:15:00.000Z", updated_at: "2026-07-13T10:15:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
  { id: "feature_snapshot_demo_002", label: "Default-risk feature vector", source_system: "Canonical bank + obligations + payroll", masked_reference: "FS-DR-••••-4402", purpose: "Default-risk model input", schema_version: "aa-risk-features-v1", status: "Pending", source_id: "synthetic_feature_build_2026_06", source_observed_at: "2026-06-30T18:30:00.000Z", freshness: "Stale", completeness: 54, feature_count: 11, explanation: "The default-risk snapshot is pending because two upstream data-quality rules are not yet passing; it will not be scored until built.", created_at: "2026-06-30T18:30:00.000Z", updated_at: "2026-06-30T18:30:00.000Z", created_by: "system.seed", updated_by: "system.seed" },
];
const evidence: FeatureSnapshotEvidence[] = [
  { id: "feature_evidence_demo_001", snapshot_id: "feature_snapshot_demo_001", source_id: "synthetic_feature_build_2026_07", observed_at: "2026-07-13T10:15:00.000Z", freshness: "Current", completeness: 88, feature_summary: "Cash-flow, liquidity, obligation, and revenue-consistency features assembled under schema aa-risk-features-v1.", lineage_summary: "Each feature records its contributing canonical sources, data completeness, and calculation version.", immutable: true },
];
const auditEvents: Array<Record<string, string>> = [];
export function getFeatureSnapshots() { return { snapshots, source_snapshots: evidence }; }
export function getFeatureSnapshot(id: string) { return snapshots.find((snapshot) => snapshot.id === id); }
export function createFeatureSnapshot(input: Pick<FeatureSnapshotRecord, "label" | "purpose" | "source_system" | "masked_reference">, actor: string) {
  const now = new Date().toISOString();
  const snapshot: FeatureSnapshotRecord = { id: `feature_snapshot_${crypto.randomUUID()}`, ...input, schema_version: "aa-risk-features-v1", status: "Pending", source_id: "synthetic_feature_request", source_observed_at: now, freshness: "Current", completeness: 0, feature_count: 0, explanation: "Build this synthetic snapshot once upstream data-quality rules pass. Snapshots are immutable inputs to scoring.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
  snapshots = [snapshot, ...snapshots];
  writeAudit("feature_snapshot_builder.created", snapshot.id, actor);
  return snapshot;
}
export function updateFeatureSnapshot(id: string, status: FeatureSnapshotStatus, actor: string) {
  const current = getFeatureSnapshot(id);
  if (!current) return undefined;
  const now = new Date().toISOString();
  const built = status === "Built";
  const updated: FeatureSnapshotRecord = { ...current, status, freshness: status === "Stale" ? "Stale" : current.freshness, completeness: built ? Math.max(current.completeness, 85) : current.completeness, last_built_at: built ? now : current.last_built_at, updated_at: now, updated_by: actor };
  snapshots = snapshots.map((snapshot) => (snapshot.id === id ? updated : snapshot));
  writeAudit("feature_snapshot_builder.updated", id, actor);
  return updated;
}
export function featureSnapshotBuilderAuditCount() { return auditEvents.length; }
function writeAudit(event_type: string, entity_id: string, actor_id: string) { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); }
