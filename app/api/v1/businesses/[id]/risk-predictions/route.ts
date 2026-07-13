import { apiError, getActor, isAllowedRole, traceId } from "../../../../../../lib/problem-statement-fit.ts";
import { getMsmeDetail } from "../../../../../../lib/msme-registry/registry.ts";
import { PD_BAND_CONFIG } from "../../../../../../lib/default-risk/risk-bands.ts";
// Prediction API (06-007 contract risk-predictions-v1): the real PD assessment for a business plus every
// governing version — model, default definition, band config — and the synthetic-data disclaimer. One scoring
// path: the same pd-engine output the registry and profiles use.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to view risk predictions.", 403);
  const detail = getMsmeDetail((await params).id);
  if (!detail) return apiError(trace_id, "NOT_FOUND", "The business was not found.", 404);
  const { msme, defaultRisk } = detail;
  return Response.json({ data: {
    businessId: msme.id, legalName: msme.legalName,
    probabilityOfDefault12M: defaultRisk.probabilityOfDefault12M, pdBand: defaultRisk.pdBand,
    segment: defaultRisk.segment, assessmentStatus: defaultRisk.status,
    factors: defaultRisk.factors,
    versions: { model: defaultRisk.modelVersion, defaultDefinition: defaultRisk.definitionVersion, bandConfig: PD_BAND_CONFIG.version, features: "aa-risk-features-v1", confidence: "pd-confidence-v1" },
    generatedAt: defaultRisk.generatedAt, isDemo: true,
    disclaimer: "This risk estimate is generated from demonstration data for product evaluation. It is not a credit decision, offer, or bureau score.",
  }, trace_id });
}
