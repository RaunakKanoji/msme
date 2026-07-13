import { apiError, getActor, isAllowedRole, traceId } from "../../../../../lib/problem-statement-fit.ts";
import { createOrganization, listOrganizations, organizationDashboardStats, publicView } from "../../../../../lib/msme-org/organization-store.ts";
// MSME organizations: list (filters + dashboard stats) and bank-created onboarding with duplicate detection and
// idempotency (spec §4.1, §15). Bank-role gated; PAN is always masked in responses.
export async function GET(request: Request) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to view MSME organizations.", 403);
  const url = new URL(request.url);
  const q = (k: string) => url.searchParams.get(k) ?? undefined;
  const organizations = listOrganizations({ status: q("status"), source: q("source"), category: q("category"), branch: q("branch"), search: q("search") }).map(publicView);
  return Response.json({ data: { organizations, stats: organizationDashboardStats() }, trace_id });
}
export async function POST(request: Request) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to create MSME organizations.", 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
  if (typeof body.legalName !== "string" || !body.legalName.trim() || typeof body.pan !== "string" || body.pan.trim().length < 10) return apiError(trace_id, "VALIDATION_ERROR", "legalName and a 10-character pan are required.", 400);
  const CONSTITUTIONS = ["PROPRIETORSHIP", "PARTNERSHIP", "LLP", "PRIVATE_LIMITED", "OPC", "HUF"] as const;
  const constitutionType = CONSTITUTIONS.includes(body.constitutionType as never) ? (body.constitutionType as (typeof CONSTITUTIONS)[number]) : undefined;
  const result = createOrganization({ legalName: body.legalName as string, tradingName: typeof body.tradingName === "string" ? body.tradingName : undefined, pan: body.pan as string, gstin: body.gstin as string | undefined, udyam: body.udyam as string | undefined, constitutionType, industryCode: body.industryCode as string | undefined, contactEmail: body.contactEmail as string | undefined, contactMobile: body.contactMobile as string | undefined, branchId: body.branchId as string | undefined, relationshipManagerId: body.relationshipManagerId as string | undefined, source: body.source === "API_IMPORT" ? "API_IMPORT" : "BANK_CREATED" }, actor.id, request.headers.get("x-idempotency-key") ?? undefined);
  if (!result.created) return Response.json({ error: { code: "DUPLICATE_ORGANIZATION", message: "An organization with the same identifier already exists. Link to it instead of creating a duplicate." }, duplicate: result.duplicate, trace_id }, { status: 409 });
  return Response.json({ data: { organization: result.organization, duplicate: result.duplicate }, trace_id }, { status: 201 });
}
