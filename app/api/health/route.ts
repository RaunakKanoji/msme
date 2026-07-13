import { getFinancialConfig } from "@/lib/financial-data/financial-config";
// GET /api/health — lightweight, unauthenticated liveness for the app itself (no secrets, no customer data).
export async function GET() {
  const cfg = getFinancialConfig();
  return Response.json({ status: "ok", time: new Date().toISOString(), financialDataProvider: cfg.mode, fallbackEnabled: cfg.fallbackEnabled });
}
