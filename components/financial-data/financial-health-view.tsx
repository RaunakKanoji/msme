"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialHealthScoreCard } from "@/components/cards/financial-health-score-card";
import { MetricCard } from "@/components/cards/metric-card";
import { InsightsCard } from "@/components/cards/insight-card";
import { RecommendationsCard } from "@/components/cards/recommendations-card";
import { MetricGrid, PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { DataSourceBadge, type DataSourceInfo } from "./data-source-badge";
import { FallbackNotice } from "./fallback-notice";
import { formatInrCompact, formatPeriod } from "@/lib/financial-data/format";
import { cardStatus, findMetric } from "@/lib/financial-data/presentation";
import type { FinancialHealthMetric, FinancialHealthResult, FinancialSnapshot } from "@/lib/financial-data/types";
// Financial Health page (Section 30): the score card stays visible; the detailed breakdown is organised into
// meaning-based tabs (Cash Flow / Revenue / Expenses / Liquidity / Debt) so the page never becomes a metric wall.
export type DefaultRiskSummary = { probabilityOfDefault12M: number; pdBand: string; status: string; modelVersion: string };
export default function FinancialHealthView({ snapshot, health, defaultRisk }: { snapshot: FinancialSnapshot; health: FinancialHealthResult; defaultRisk?: DefaultRiskSummary }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const source = health.source as unknown as DataSourceInfo;
  const period = formatPeriod(snapshot.periodStart, snapshot.periodEnd);
  const m = (id: string) => findMetric(health.metrics, id);
  const metricCard = (metric: FinancialHealthMetric | undefined, title: string) => metric
    ? <MetricCard title={title} value={metric.formattedValue} status={cardStatus(metric.status)} trend={metric.trend ? { direction: metric.trend, value: metric.formattedValue } : undefined} description={metric.explanation} />
    : <MetricCard title={title} value="—" unavailable description="Not enough data for this period." />;
  function refresh() { setRefreshing(true); router.refresh(); setTimeout(() => setRefreshing(false), 1200); }
  return <div className="app-overview">
    <header className="page-header"><div><h1>Financial health</h1><p>Explainable analysis for {snapshot.businessName}. Not a credit decision.</p><div className="overview-header-meta"><span>Period {period}</span><span>Calculated {new Date(health.calculatedAt).toLocaleString("en-IN")}</span></div></div><Button variant="outline" onClick={refresh} disabled={refreshing}>{refreshing ? "Refreshing…" : "Refresh data"}</Button></header>
    <FallbackNotice source={source} />
    <FinancialHealthScoreCard score={health.overallScore} category={health.category} description={`Weighted across ${health.metrics.length} explainable indicators for this period.`} reportingPeriod={period} dataCompleteness={health.dataCompleteness} source={source} />
    {defaultRisk ? <Card className="pd-strip"><CardContent><div className="pd-strip-row"><div><strong>Predicted 12-month probability of default: {(defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}%</strong><p className="metric-card-note">A separate estimate from your health score — the likelihood of a defined credit-default event within 12 months. {defaultRisk.status === "PROVISIONAL" ? "This estimate is provisional until more data is connected." : ""} Not a bureau score.</p></div><span className="metric-card-note">{defaultRisk.pdBand.replaceAll("_", " ")} · {defaultRisk.modelVersion}</span></div></CardContent></Card> : null}
    <Tabs defaultValue="cash-flow">
      <TabsList>
        <TabsTrigger value="cash-flow">Cash flow</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
        <TabsTrigger value="debt">Debt</TabsTrigger>
      </TabsList>
      <TabsContent value="cash-flow">
        <p className="metric-card-note">Your ability to generate and maintain sufficient operating cash.</p>
        <MetricGrid columns={3}>{metricCard(m("cash-flow-stability"), "Cash-flow stability")}<MetricCard title="Net cash flow" value={formatInrCompact(snapshot.netCashFlow)} status={snapshot.netCashFlow >= 0 ? "positive" : "negative"} description="Average monthly inflows minus outflows." /><MetricCard title="Monthly inflows" value={formatInrCompact(snapshot.monthlyRevenue)} status="neutral" description="Average customer receipts per month." /></MetricGrid>
      </TabsContent>
      <TabsContent value="revenue">
        <p className="metric-card-note">How consistently the business earns.</p>
        <MetricGrid columns={3}>{metricCard(m("revenue-trend"), "Revenue trend")}<MetricCard title="Monthly revenue" value={formatInrCompact(snapshot.monthlyRevenue)} status="positive" description="Average revenue across the period." /></MetricGrid>
      </TabsContent>
      <TabsContent value="expenses">
        <p className="metric-card-note">How outflows compare against earnings.</p>
        <MetricGrid columns={3}>{metricCard(m("expense-ratio"), "Expense ratio")}<MetricCard title="Monthly expenses" value={formatInrCompact(snapshot.monthlyExpenses)} status="neutral" description="Average outflows across the period." /></MetricGrid>
      </TabsContent>
      <TabsContent value="liquidity">
        <p className="metric-card-note">Buffers available to absorb short-term pressure.</p>
        <MetricGrid columns={3}>{metricCard(m("liquidity"), "Liquidity buffer")}{metricCard(m("working-capital"), "Working capital")}<MetricCard title="Average balance" value={formatInrCompact(snapshot.averageBalance)} status="neutral" description="Mean month-end balance across accounts." /></MetricGrid>
      </TabsContent>
      <TabsContent value="debt">
        <p className="metric-card-note">Obligations and the capacity to service them.</p>
        <MetricGrid columns={3}>{metricCard(m("debt-service"), "Debt-service coverage")}<MetricCard title="Monthly obligations" value={formatInrCompact(snapshot.debtObligations)} status="neutral" description="Recurring EMI and debt payments." /><MetricCard title="Outstanding liabilities" value={formatInrCompact(snapshot.liabilities)} status="neutral" description="Total outstanding principal." /></MetricGrid>
      </TabsContent>
    </Tabs>
    <PageSection title="Strengths and risks" description="What supports the score, and what needs attention.">
      <TwoColumnGrid>
        <InsightsCard type="strength" insights={health.strengths.map((s) => ({ id: s.id, title: s.title, description: s.detail }))} emptyText="No standout strengths this period." />
        <InsightsCard type="risk" insights={health.risks.map((r) => ({ id: r.id, title: r.title, description: r.detail }))} emptyText="No elevated risks detected." />
      </TwoColumnGrid>
    </PageSection>
    <PageSection title="Recommended actions">
      <RecommendationsCard recommendations={health.recommendations} limit={5} />
    </PageSection>
    <details className="methodology"><summary>Methodology</summary><p className="metric-card-note">Six indicators are scored deterministically from your normalized financial snapshot and blended with fixed weights (cash-flow stability 20%, revenue trend 18%, debt-service 18%, liquidity 16%, expense ratio 16%, working capital 12%). Scores of 67+ read as good, 45–66 as watch, below 45 as at-risk. No machine-learning model is used, and the result is not a lending decision.</p></details>
    <Card><CardHeader><div><CardTitle>Data quality and source</CardTitle><CardDescription>Where these figures come from.</CardDescription></div><DataSourceBadge source={source} /></CardHeader><CardContent><ul className="kv-list"><li><span>Accounts</span><strong>{snapshot.accounts.length}</strong></li><li><span>Transactions analysed</span><strong>{snapshot.transactions.length}</strong></li><li><span>Data completeness</span><strong>{health.dataCompleteness}%</strong></li></ul>{source.status !== "live" && source.message ? <p className="metric-card-note">{source.message}</p> : null}</CardContent></Card>
  </div>;
}
