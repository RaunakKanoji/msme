import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge, type DataSourceInfo } from "@/components/financial-data/data-source-badge";
import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageSection } from "@/components/page/page-section";
import { getFinancialHealth } from "@/lib/financial-data/financial-data-service";
import { formatPeriod } from "@/lib/financial-data/format";
// Reports: one prominent latest-analysis card + an honest empty state for exportable report history. No fake
// downloadable files are offered — export lands with the report-generation workflow.
export default async function ReportsPage() {
  const session = await auth();
  const result = await getFinancialHealth({ businessId: `business_${session.orgId ?? "demo"}` });
  const health = result.ok ? result.data.health : null;
  const snapshot = result.ok ? result.data.snapshot : null;
  const source = health ? (health.source as unknown as DataSourceInfo) : null;
  return <div className="app-overview">
    <header className="page-header"><div><h1>Reports</h1><p>Financial-health reports generated from your latest analysis.</p></div></header>
    <PageSection title="Latest analysis">
      {health && snapshot && source ? <Card className="score-card">
        <CardHeader className="score-card-header"><div><CardTitle>Financial health analysis</CardTitle><CardDescription>{formatPeriod(snapshot.periodStart, snapshot.periodEnd)}</CardDescription></div><div className="score-card-badges"><Badge variant={health.overallScore >= 68 ? "success" : "warning"}>{health.overallScore}/100</Badge><DataSourceBadge source={source} /></div></CardHeader>
        <CardContent><p className="metric-card-note">Calculated {new Date(health.calculatedAt).toLocaleString("en-IN")} from {snapshot.transactions.length} transactions across {snapshot.accounts.length} accounts. {source.status !== "live" ? "This analysis is based on fallback data and is labelled accordingly." : ""}</p></CardContent>
        <CardFooter className="score-card-footer"><span className="metric-card-note">Data completeness {health.dataCompleteness}%</span><Link href="/app/financial-health"><Button variant="outline">View analysis</Button></Link></CardFooter>
      </Card> : <EmptyStateCard title="No analysis available" description="Financial data is temporarily unavailable, so no report can be shown. Retry from the financial health page." actionLabel="Open financial health" actionHref="/app/financial-health" />}
    </PageSection>
    <PageSection title="Report history" description="Generated, downloadable reports.">
      <EmptyStateCard title="No reports generated yet" description="Exportable report generation (PDF/registry) is not yet part of this prototype. When it lands, generated reports will appear here with their reporting period, score, data source, and download action." actionLabel="Review financial health" actionHref="/app/financial-health" />
    </PageSection>
  </div>;
}
