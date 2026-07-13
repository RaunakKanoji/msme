import { auth } from "@clerk/nextjs/server";
import FinancialHealthView from "@/components/financial-data/financial-health-view";
import { ProviderUnavailableState } from "@/components/financial-data/states";
import { getFinancialHealth } from "@/lib/financial-data/financial-data-service";
import { assessDefaultRisk } from "@/lib/default-risk/pd-engine";
// Server component: resolves the Track 03 health result through the financial-data service (auto → cache → mock),
// so the page renders fully even while Setu is unavailable. The 12-month PD is shown separately from the score.
export default async function FinancialHealthPage() {
  const session = await auth();
  const businessId = `business_${session.orgId ?? "demo"}`;
  const result = await getFinancialHealth({ businessId });
  if (!result.ok) return <ProviderUnavailableState code={result.error.code} />;
  const pd = assessDefaultRisk(result.data.snapshot);
  return <FinancialHealthView snapshot={result.data.snapshot} health={result.data.health} defaultRisk={{ probabilityOfDefault12M: pd.probabilityOfDefault12M, pdBand: pd.pdBand, status: pd.status, modelVersion: pd.modelVersion }} />;
}
