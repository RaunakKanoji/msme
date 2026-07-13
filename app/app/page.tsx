import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialHealthScoreCard } from "@/components/cards/financial-health-score-card";
import { DataSourceCard } from "@/components/cards/data-source-card";
import { MetricCard } from "@/components/cards/metric-card";
import { TrendCard } from "@/components/cards/trend-card";
import { InsightsCard } from "@/components/cards/insight-card";
import { RecommendationsCard } from "@/components/cards/recommendations-card";
import { MetricGrid, PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { FallbackNotice } from "@/components/financial-data/fallback-notice";
import { ProviderUnavailableState } from "@/components/financial-data/states";
import type { DataSourceInfo } from "@/components/financial-data/data-source-badge";
import { getFinancialHealth } from "@/lib/financial-data/financial-data-service";
import { formatInrCompact, formatPeriod, monthlyTrend } from "@/lib/financial-data/format";
import { cardStatus, findMetric } from "@/lib/financial-data/presentation";
// Overview (Section 29): summaries only — the Financial Health page carries the detail. One primary score card,
// one data-connection card, at most eight metric cards, one trend card, grouped insights and recommendations.
export default async function AppHome() {
  const session = await auth();
  const result = await getFinancialHealth({ businessId: `business_${session.orgId ?? "demo"}` });
  if (!result.ok) return <ProviderUnavailableState code={result.error.code} />;
  const { snapshot, health } = result.data;
  const source = health.source as unknown as DataSourceInfo;
  const trend = monthlyTrend(snapshot);
  const last = trend[trend.length - 1];
  const availableBalance = snapshot.accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const liquidity = findMetric(health.metrics, "liquidity");
  const debtService = findMetric(health.metrics, "debt-service");
  const workingCapital = findMetric(health.metrics, "working-capital");
  return <div className="app-overview">
    <header className="page-header"><div><h1>{snapshot.businessName}</h1><p>Financial overview for the current reporting period.</p><div className="overview-header-meta"><span>Period {formatPeriod(snapshot.periodStart, snapshot.periodEnd)}</span><span>Updated {new Date(source.status === "live" ? health.calculatedAt : health.calculatedAt).toLocaleString("en-IN")}</span></div></div><Link href="/app/financial-health"><Button>Open financial health</Button></Link></header>
    <FallbackNotice source={source} />
    <div className="primary-grid">
      <FinancialHealthScoreCard score={health.overallScore} category={health.category} description={health.metrics.length ? summarize(health.strengths.length, health.risks.length) : "Awaiting sufficient data."} reportingPeriod={formatPeriod(snapshot.periodStart, snapshot.periodEnd)} dataCompleteness={health.dataCompleteness} source={source} detailHref="/app/financial-health" />
      <DataSourceCard source={source} accountCount={snapshot.accounts.length} reportingPeriod={formatPeriod(snapshot.periodStart, snapshot.periodEnd)} />
    </div>
    <PageSection title="Key metrics" description="Averages across the reporting period.">
      <MetricGrid columns={4}>
        <MetricCard title="Monthly revenue" value={formatInrCompact(snapshot.monthlyRevenue)} status="positive" description="Average customer receipts per month." />
        <MetricCard title="Monthly expenses" value={formatInrCompact(snapshot.monthlyExpenses)} status="neutral" description="Average outflows per month." />
        <MetricCard title="Net cash flow" value={formatInrCompact(snapshot.netCashFlow)} status={snapshot.netCashFlow >= 0 ? "positive" : "negative"} description="Inflows minus outflows per month." />
        <MetricCard title="Available balance" value={formatInrCompact(availableBalance)} status="neutral" description={`Across ${snapshot.accounts.length} connected accounts.`} />
      </MetricGrid>
    </PageSection>
    <PageSection title="Position" description="Liquidity, obligations, and capital.">
      <MetricGrid columns={4}>
        <MetricCard title="Liquidity" value={liquidity?.formattedValue ?? "—"} unavailable={!liquidity} status={liquidity ? cardStatus(liquidity.status) : "neutral"} description={liquidity?.explanation} />
        <MetricCard title="Debt-service coverage" value={debtService?.formattedValue ?? "—"} unavailable={!debtService} status={debtService ? cardStatus(debtService.status) : "neutral"} description={debtService?.explanation} />
        <MetricCard title="Working capital" value={workingCapital?.formattedValue ?? "—"} unavailable={!workingCapital} status={workingCapital ? cardStatus(workingCapital.status) : "neutral"} description={workingCapital?.explanation} />
        <MetricCard title="Data completeness" value={`${health.dataCompleteness}%`} status={health.dataCompleteness >= 80 ? "positive" : "warning"} description="Coverage of the sources behind this analysis." />
      </MetricGrid>
    </PageSection>
    <PageSection title="Financial trend" description="Monthly revenue against expenses.">
      <TrendCard points={trend} summary={last ? `Latest month: revenue ${formatInrCompact(last.revenue)} against expenses ${formatInrCompact(last.expenses)} — ${last.revenue >= last.expenses ? "a cash-positive month." : "expenses exceeded revenue."}` : "No monthly activity in this period."} />
    </PageSection>
    <PageSection title="Insights" description="What is supporting or holding back the score.">
      <TwoColumnGrid>
        <InsightsCard type="strength" insights={health.strengths.map((s) => ({ id: s.id, title: s.title, description: s.detail }))} emptyText="No standout strengths this period." />
        <InsightsCard type="risk" insights={health.risks.map((r) => ({ id: r.id, title: r.title, description: r.detail }))} emptyText="No elevated risks detected." />
      </TwoColumnGrid>
    </PageSection>
    <PageSection title="Actions" description="Top recommendations for this period.">
      <RecommendationsCard recommendations={health.recommendations} limit={3} />
    </PageSection>
    <PageSection title="Recent activity">
      <Card><CardHeader><div><CardTitle>Latest events</CardTitle><CardDescription>Most recent workspace activity.</CardDescription></div></CardHeader><CardContent><ul className="insight-list"><li className="insight-row"><div className="insight-row-text"><strong>Health score calculated</strong><span>{new Date(health.calculatedAt).toLocaleString("en-IN")}</span></div><span className="insight-row-value">{health.overallScore}/100</span></li><li className="insight-row"><div className="insight-row-text"><strong>Financial data resolved</strong><span>{source.status === "live" ? "Live provider" : source.status === "cached" ? "Cached snapshot" : "Demonstration dataset"}</span></div><span className="insight-row-value">{snapshot.transactions.length} txns</span></li></ul></CardContent></Card>
    </PageSection>
  </div>;
}
function summarize(strengths: number, risks: number): string {
  if (!risks) return "Core indicators are steady this period, with no elevated risks detected.";
  if (!strengths) return "Several indicators need attention this period — review the risks below.";
  return `${strengths} indicator${strengths === 1 ? " is" : "s are"} supporting the score while ${risks} need${risks === 1 ? "s" : ""} attention.`;
}
