import { apiError, getActor, getScopeItem, isAllowedRole, traceId, updateScopeItem } from "../../../../../lib/track-03-04-scope.ts";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId(); const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to update track scope.", 403);
  const { id } = await params;
  if (!getScopeItem(id)) return apiError(trace_id, "NOT_FOUND", "Scope item was not found.", 404);
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
  const permitted = ["capability", "outcome", "explanation", "status"];
  const changes = Object.fromEntries(Object.entries(body).filter(([key, value]) => permitted.includes(key) && typeof value === "string" && value.trim()));
  if (!Object.keys(changes).length) return apiError(trace_id, "VALIDATION_ERROR", "Provide at least one valid field to update.", 400);
  return Response.json({ data: updateScopeItem(id, changes, actor.id), trace_id });
}
