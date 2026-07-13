import { auth } from "@clerk/nextjs/server";
import { getFinancialConfig, scenarioSelectionAllowed } from "@/lib/financial-data/financial-config";
import { safeMessage } from "@/lib/financial-data/provider-result";
import { getFinancialSnapshot } from "@/lib/financial-data/financial-data-service";
import type { MockFinancialScenario } from "@/lib/financial-data/types";
// GET /api/financial-data — normalized snapshot + data-source metadata. Authenticated; business scoped to the caller's
// organisation. Never returns raw Setu shapes; never exposes provider secrets or raw provider errors.
export async function GET(request: Request) {
  const session = await auth();
  const userId = session.userId ?? (process.env.NODE_ENV === "test" ? request.headers.get("x-test-user-id") : null);
  const organisationId = session.orgId ?? (process.env.NODE_ENV === "test" ? request.headers.get("x-test-organisation-id") : null);
  if (!userId || !organisationId) return Response.json({ success: false, error: { code: "UNAUTHORIZED", message: "Sign in to view financial data." } }, { status: 401 });
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId") || `business_${organisationId}`;
  const scenarioParam = url.searchParams.get("scenario");
  const cfg = getFinancialConfig();
  const scenario = scenarioParam && scenarioSelectionAllowed() ? (scenarioParam as MockFinancialScenario) : undefined;
  const result = await getFinancialSnapshot({ businessId, scenario, refresh: url.searchParams.get("refresh") === "true" });
  if (!result.ok) return Response.json({ success: false, error: { code: result.error.code, message: safeMessage(result.error) }, providerMode: cfg.mode }, { status: 503 });
  return Response.json({ success: true, data: result.data, source: { provider: result.source.provider, status: result.source.status, isFallback: result.source.isFallback, isStale: result.source.isStale, fetchedAt: result.source.fetchedAt, message: result.source.message } });
}
