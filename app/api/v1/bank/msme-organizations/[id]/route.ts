import { apiError, getActor, isAllowedRole, traceId } from "../../../../../../lib/problem-statement-fit.ts";
import { getOrganizationBundle, transitionStatus } from "../../../../../../lib/msme-org/organization-store.ts";
const STATUSES = ["PROSPECT", "INVITED", "REGISTRATION_STARTED", "IDENTITY_PENDING", "DATA_CONNECTION_PENDING", "DOCUMENTS_PENDING", "UNDER_VERIFICATION", "READY_FOR_ASSESSMENT", "SCORING", "ACTIVE", "MONITORING", "SUSPENDED", "DORMANT", "CLOSED", "REJECTED", "ARCHIVED"];
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to view MSME organizations.", 403);
  const bundle = getOrganizationBundle((await params).id);
  if (!bundle) return apiError(trace_id, "NOT_FOUND", "MSME organization was not found.", 404);
  return Response.json({ data: bundle, trace_id });
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to update MSME organizations.", 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
  if (!STATUSES.includes(body.onboardingStatus as string)) return apiError(trace_id, "VALIDATION_ERROR", "onboardingStatus must be a supported lifecycle status.", 400);
  const updated = transitionStatus((await params).id, body.onboardingStatus as never, actor.id, typeof body.note === "string" ? body.note : undefined);
  if (!updated) return apiError(trace_id, "NOT_FOUND", "MSME organization was not found.", 404);
  return Response.json({ data: updated, trace_id });
}
