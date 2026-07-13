import { apiError, getActor, isAllowedRole, traceId } from "../../../../../lib/problem-statement-fit.ts";
import { getMsmeDetail } from "../../../../../lib/msme-registry/registry.ts";
// One canonical MSME 360 record: identity, snapshot summary, health assessment, PD assessment, alerts.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trace_id = traceId();
  const actor = getActor(request);
  if (!isAllowedRole(actor.role)) return apiError(trace_id, "AUTHORIZATION_DENIED", "You are not authorized to view MSME records.", 403);
  const detail = getMsmeDetail((await params).id);
  if (!detail) return apiError(trace_id, "NOT_FOUND", "MSME record was not found.", 404);
  const { snapshot, ...rest } = detail;
  return Response.json({ data: { ...rest, snapshotSummary: { accounts: snapshot.accounts.length, transactions: snapshot.transactions.length, monthlyRevenue: snapshot.monthlyRevenue, monthlyExpenses: snapshot.monthlyExpenses, netCashFlow: snapshot.netCashFlow, averageBalance: snapshot.averageBalance, liabilities: snapshot.liabilities, debtObligations: snapshot.debtObligations, periodStart: snapshot.periodStart, periodEnd: snapshot.periodEnd, source: snapshot.metadata } }, trace_id });
}
