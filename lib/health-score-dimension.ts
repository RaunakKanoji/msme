// Shared factory for the 05-financial-health-card dimension scores (specs 05-002 … 05-010). Each dimension is a
// deterministic, explainable score with factors, confidence, and freshness. The factory keeps the nine dimension
// libs to just their seed data; routes and tests stay uniform. No ML — versioned, source-linked, auditable.
export type ScoreBand = "Healthy" | "Watch" | "Stress";
export type ScoreStatus = "Published" | "Needs review" | "Draft";
export type DimensionFactor = { label: string; detail: string };
export type DimensionScore = { id: string; business_name: string; masked_reference: string; label: string; source_system: string; status: ScoreStatus; score: number; band: ScoreBand; confidence: number; source_id: string; source_observed_at: string; freshness: "Current" | "Stale"; completeness: number; explanation: string; factors: DimensionFactor[]; last_scored_at?: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export type DimensionSnapshot = { id: string; score_id: string; source_id: string; observed_at: string; freshness: "Current" | "Stale"; completeness: number; score_summary: string; coverage_summary: string; immutable: true };
export const DIMENSION_STATUSES: ScoreStatus[] = ["Published", "Needs review", "Draft"];
export function bandForScore(score: number): ScoreBand { return score >= 70 ? "Healthy" : score >= 45 ? "Watch" : "Stress"; }
export type DimensionCreateInput = Pick<DimensionScore, "business_name" | "masked_reference" | "label" | "source_system">;
export type DimensionStore = { list: () => { scores: DimensionScore[]; source_snapshots: DimensionSnapshot[] }; get: (id: string) => DimensionScore | undefined; create: (input: DimensionCreateInput, actor: string) => DimensionScore; update: (id: string, status: ScoreStatus, actor: string) => DimensionScore | undefined; auditCount: () => number };
export function createDimensionStore(config: { prefix: string; auditType: string; seed: DimensionScore[]; snapshots: DimensionSnapshot[] }): DimensionStore {
  let scores = config.seed;
  const snapshots = config.snapshots;
  const auditEvents: Array<Record<string, string>> = [];
  const writeAudit = (event_type: string, entity_id: string, actor_id: string) => { auditEvents.push({ id: `audit_${crypto.randomUUID()}`, event_type, entity_id, actor_id, occurred_at: new Date().toISOString() }); };
  return {
    list: () => ({ scores, source_snapshots: snapshots }),
    get: (id) => scores.find((score) => score.id === id),
    create: (input, actor) => {
      const now = new Date().toISOString();
      const score: DimensionScore = { id: `${config.prefix}_${crypto.randomUUID()}`, ...input, status: "Draft", score: 0, band: "Stress", confidence: 0, source_id: `synthetic_${config.prefix}_request`, source_observed_at: now, freshness: "Current", completeness: 0, explanation: "Publish once the dimension is scored from canonical sources. Scores are explainable analytical signals, not a credit decision.", factors: [], created_at: now, updated_at: now, created_by: actor, updated_by: actor };
      scores = [score, ...scores];
      writeAudit(`${config.auditType}.created`, score.id, actor);
      return score;
    },
    update: (id, status, actor) => {
      const current = scores.find((score) => score.id === id);
      if (!current) return undefined;
      const now = new Date().toISOString();
      const published = status === "Published";
      const updated: DimensionScore = { ...current, status, freshness: status === "Needs review" ? "Stale" : current.freshness, last_scored_at: published ? now : current.last_scored_at, updated_at: now, updated_by: actor };
      scores = scores.map((score) => (score.id === id ? updated : score));
      writeAudit(`${config.auditType}.updated`, id, actor);
      return updated;
    },
    auditCount: () => auditEvents.length,
  };
}
