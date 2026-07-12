import {
  apiError,
  getActor,
  getAssessment,
  isAllowedRole,
  traceId,
  updateAssessment,
} from "../../../../../lib/problem-statement-fit.ts";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to update an assessment.", 403);
  const { id } = await params;
  if (!getAssessment(id)) return apiError(trace_id, "NOT_FOUND", "Assessment was not found.", 404);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }
  const permitted = ["title", "recommendation", "explanation", "status"];
  const changes = Object.fromEntries(Object.entries(body).filter(([key, value]) => permitted.includes(key) && typeof value === "string" && value.trim()));
  if (!Object.keys(changes).length) return apiError(trace_id, "VALIDATION_ERROR", "Provide at least one valid field to update.", 400);
  const assessment = updateAssessment(id, changes, actor.id);
  return Response.json({ data: assessment, trace_id });
}
