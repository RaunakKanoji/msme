import { apiError, getActor, isAllowedRole, traceId } from "../../../../../../lib/problem-statement-fit.ts";
import { importOrganizations, type ImportRow } from "../../../../../../lib/msme-org/organization-store.ts";
// Bulk import (spec §4.4): JSON rows with dry-run validation, duplicate detection, invalid-record reporting,
// partial success, and an import summary. CSV/XLSX parsing feeds this same endpoint when file upload lands.
export async function POST(request: Request) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to import MSMEs.", 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return apiError(trace_id, "VALIDATION_ERROR", "Request body must be valid JSON.", 400); }
  if (!Array.isArray(body.rows) || body.rows.length === 0) return apiError(trace_id, "VALIDATION_ERROR", "rows must be a non-empty array.", 400);
  if (body.rows.length > 500) return apiError(trace_id, "VALIDATION_ERROR", "A maximum of 500 rows per import is supported.", 400);
  const result = importOrganizations(body.rows as ImportRow[], { dryRun: body.dryRun !== false }, actor.id);
  return Response.json({ data: result, trace_id }, { status: result.summary.dryRun ? 200 : 201 });
}
