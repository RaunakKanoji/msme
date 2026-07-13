import { apiError, getActor, isAllowedRole, traceId } from "../../../../../../../lib/problem-statement-fit.ts";
import { inviteOrganization } from "../../../../../../../lib/msme-org/organization-store.ts";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to invite MSMEs.", 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
  if (typeof body.contact !== "string" || !body.contact.trim()) return apiError(trace_id, "VALIDATION_ERROR", "contact (email or mobile) is required.", 400);
  const invitation = inviteOrganization((await params).id, body.contact as string, Array.isArray(body.requestedActions) ? (body.requestedActions as string[]) : ["COMPLETE_ONBOARDING"], actor.id);
  if (!invitation) return apiError(trace_id, "NOT_FOUND", "MSME organization was not found.", 404);
  return Response.json({ data: invitation, trace_id }, { status: 201 });
}
