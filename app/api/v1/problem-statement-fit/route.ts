import {
  apiError,
  createAssessment,
  getActor,
  isAllowedRole,
  listAssessments,
  traceId,
} from "../../../../lib/problem-statement-fit.ts";

export async function GET(request: Request) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to view problem statement assessments.", 403);
  return Response.json({ data: listAssessments(), trace_id });
}

export async function POST(request: Request) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to create an assessment.", 403);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }
  const fields = ["organization_name", "title", "recommendation", "explanation"] as const;
  if (fields.some((field) => typeof body[field] !== "string" || !body[field].trim())) {
    return apiError(trace_id, "VALIDATION_ERROR", "organization_name, title, recommendation, and explanation are required.", 400);
  }
  const assessment = createAssessment(body as Record<(typeof fields)[number], string>, actor.id);
  return Response.json({ data: assessment, trace_id }, { status: 201 });
}
