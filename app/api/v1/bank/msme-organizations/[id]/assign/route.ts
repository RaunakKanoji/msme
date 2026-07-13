import { apiError, getActor, isAllowedRole, traceId } from "../../../../../../../lib/problem-statement-fit.ts";
import { assignOrganization } from "../../../../../../../lib/msme-org/organization-store.ts";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to assign MSMEs.", 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
  if (typeof body.branchId !== "string" || typeof body.relationshipManagerId !== "string") return apiError(trace_id, "VALIDATION_ERROR", "branchId and relationshipManagerId are required.", 400);
  const bundle = assignOrganization((await params).id, body.branchId as string, body.relationshipManagerId as string, actor.id);
  if (!bundle) return apiError(trace_id, "NOT_FOUND", "MSME organization was not found.", 404);
  return Response.json({ data: bundle, trace_id });
}
