import { getProviderHealthStatus } from "@/lib/financial-data/financial-data-service";
// GET /api/integrations/setu/health — safe provider status. Never exposes secrets, tokens, upstream bodies, or PII.
export async function GET() {
  const status = await getProviderHealthStatus();
  return Response.json(status);
}
