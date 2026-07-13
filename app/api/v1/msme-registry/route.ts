import { apiError, getActor, isAllowedRole, traceId } from "../../../../lib/problem-statement-fit.ts";
import { filterRegistry, portfolioSummary } from "../../../../lib/msme-registry/registry.ts";
// Central MSME registry list + portfolio summary. Bank-role gated; borrower roles are denied (Section 5).
export async function GET(request: Request) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to view the MSME registry.", 403);
  const url = new URL(request.url);
  const q = (key: string) => url.searchParams.get(key) ?? undefined;
  const num = (key: string) => { const v = url.searchParams.get(key); return v == null ? undefined : Number(v); };
  const msmes = filterRegistry({ band: q("band"), segment: q("segment"), industry: q("industry"), state: q("state"), search: q("search"), minScore: num("minScore"), maxScore: num("maxScore"), alertsOnly: url.searchParams.get("alertsOnly") === "true" });
  return Response.json({ data: { msmes, summary: portfolioSummary() }, trace_id });
}
