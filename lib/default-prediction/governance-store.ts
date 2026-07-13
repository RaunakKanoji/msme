import { apiError, getActor, isAllowedRole, traceId } from "../problem-statement-fit.ts";
// Shared factory for the 06-default-prediction-ml governance records (specs 06-001 … 06-012). Each record is a
// versioned, auditable ML-governance artifact (definition, window, feature set, dataset run, model candidate,
// calibration config, …) with status workflow and an immutable summary. One factory + one handler set keeps the
// twelve slices to their seed data — no twelve near-copies.
export type GovernanceStatus = "Adopted" | "Needs review" | "Draft";
export type GovernanceRecord = { id: string; label: string; version: string; status: GovernanceStatus; owner: string; summary: string; detail: string; source_id: string; freshness: "Current" | "Stale"; completeness: number; immutable_note: string; created_at: string; updated_at: string; created_by: string; updated_by: string };
export const GOVERNANCE_STATUSES: GovernanceStatus[] = ["Adopted", "Needs review", "Draft"];
export type GovernanceStore = { list: () => { records: GovernanceRecord[] }; get: (id: string) => GovernanceRecord | undefined; create: (input: Pick<GovernanceRecord, "label" | "version" | "summary">, actor: string) => GovernanceRecord; update: (id: string, status: GovernanceStatus, actor: string) => GovernanceRecord | undefined; auditCount: () => number };
export function createGovernanceStore(prefix: string, auditType: string, seed: GovernanceRecord[]): GovernanceStore {
  let records = seed;
  const audit: Array<Record<string, string>> = [];
  const log = (event: string, entityId: string, actor: string) => audit.push({ id: `audit_${crypto.randomUUID()}`, event, entityId, actor, at: new Date().toISOString() });
  return {
    list: () => ({ records }),
    get: (id) => records.find((r) => r.id === id),
    create: (input, actor) => {
      const now = new Date().toISOString();
      const record: GovernanceRecord = { id: `${prefix}_${crypto.randomUUID()}`, label: input.label, version: input.version, status: "Draft", owner: "Model risk (demo)", summary: input.summary, detail: "Draft record pending model-risk review. Synthetic demonstration data only.", source_id: `synthetic_${prefix}_request`, freshness: "Current", completeness: 0, immutable_note: "Adopted versions are immutable; changes create a new version.", created_at: now, updated_at: now, created_by: actor, updated_by: actor };
      records = [record, ...records];
      log(`${auditType}.created`, record.id, actor);
      return record;
    },
    update: (id, status, actor) => {
      const current = records.find((r) => r.id === id);
      if (!current) return undefined;
      const updated: GovernanceRecord = { ...current, status, freshness: status === "Needs review" ? "Stale" : current.freshness, updated_at: new Date().toISOString(), updated_by: actor };
      records = records.map((r) => (r.id === id ? updated : r));
      log(`${auditType}.updated`, id, actor);
      return updated;
    },
    auditCount: () => audit.length,
  };
}
// Uniform route handlers (house pattern: RBAC, trace_id, validation, audit) shared by all twelve slices.
export function makeGovernanceHandlers(store: GovernanceStore, noun: string) {
  return {
    async GET(request: Request) {
      const trace_id = traceId(); const actor = getActor(request);
      if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", `You are not authorized to view ${noun}.`, 403);
      return Response.json({ data: store.list(), trace_id });
    },
    async POST(request: Request) {
      const trace_id = traceId(); const actor = getActor(request);
      if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", `You are not authorized to create ${noun}.`, 403);
      let body: Record<string, unknown>;
      try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
      const fields = ["label", "version", "summary"] as const;
      if (fields.some((f) => typeof body[f] !== "string" || !(body[f] as string).trim())) return apiError(trace_id, "VALIDATION_ERROR", "label, version, and summary are required.", 400);
      return Response.json({ data: store.create(body as { label: string; version: string; summary: string }, actor.id), trace_id }, { status: 201 });
    },
    async PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
      const trace_id = traceId(); const actor = getActor(request);
      if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", `You are not authorized to update ${noun}.`, 403);
      const { id } = await params;
      if (!store.get(id)) return apiError(trace_id, "NOT_FOUND", `The ${noun} record was not found.`, 404);
      let body: Record<string, unknown>;
      try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
      if (!GOVERNANCE_STATUSES.includes(body.status as never)) return apiError(trace_id, "VALIDATION_ERROR", "status must be a supported governance status.", 400);
      return Response.json({ data: store.update(id, body.status as GovernanceStatus, actor.id), trace_id });
    },
  };
}
export function seedRecord(prefix: string, index: number, fields: Pick<GovernanceRecord, "label" | "version" | "status" | "summary" | "detail" | "completeness">): GovernanceRecord {
  const at = new Date(Date.UTC(2026, 6, 1 + index)).toISOString();
  return { id: `${prefix}_demo_${String(index + 1).padStart(3, "0")}`, owner: "Model risk (demo)", source_id: `synthetic_${prefix}_2026_07`, freshness: fields.status === "Needs review" ? "Stale" : "Current", immutable_note: "Adopted versions are immutable; changes create a new version.", created_at: at, updated_at: at, created_by: "system.seed", updated_by: "system.seed", ...fields };
}
