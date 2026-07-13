import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/cards/metric-card";
import { MetricGrid, PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { FallbackNotice } from "@/components/financial-data/fallback-notice";
import { ProviderUnavailableState } from "@/components/financial-data/states";
import type { DataSourceInfo } from "@/components/financial-data/data-source-badge";
import { getFinancialHealth } from "@/lib/financial-data/financial-data-service";
import { assessDefaultRisk } from "@/lib/default-risk/pd-engine";
import { formatInrCompact } from "@/lib/financial-data/format";
// Owner dashboard (10-001): plain-language home for the business owner — score, risk outlook, top actions,
// documents, consents, and support in one supportive view. Same engines as everywhere else.
export default async function OwnerDashboardPage() {
  const session = await auth();
  const result = await getFinancialHealth({ businessId: `business_${session.orgId ?? "demo"}` });
  if (!result.ok) return <ProviderUnavailableState code={result.error.code} />;
  const { snapshot, health } = result.data;
  const pd = assessDefaultRisk(snapshot);
  const source = health.source as unknown as DataSourceInfo;
  const topActions = health.recommendations.slice(0, 3);
  return <div className="app-overview">
    <header className="page-header"><div><h1>Your business at a glance</h1><p>{snapshot.businessName} — everything important in one place, in plain language.</p></div><Link href="/app/owner/health"><Button>Understand your score</Button></Link></header>
    <FallbackNotice source={source} />
    <MetricGrid columns={4}>
      <MetricCard title="Financial health" value={`${health.overallScore}/100`} status={health.overallScore >= 65 ? "positive" : "warning"} description={health.overallScore >= 65 ? "Your business looks steady." : "A few areas need attention."} />
      <MetricCard title="12-month risk outlook" value={`${(pd.probabilityOfDefault12M * 100).toFixed(1)}%`} status={pd.probabilityOfDefault12M < 0.06 ? "positive" : "warning"} description="An outlook, not a decision or bureau score." />
      <MetricCard title="Monthly net cash flow" value={formatInrCompact(snapshot.netCashFlow)} status={snapshot.netCashFlow >= 0 ? "positive" : "negative"} description="What stays after expenses." />
      <MetricCard title="Data completeness" value={`${health.dataCompleteness}%`} status={health.dataCompleteness >= 80 ? "positive" : "warning"} description="Fresher data means a fairer picture." />
    </MetricGrid>
    <PageSection title="Your top actions" description="The highest-impact steps for this period (improve-plan-v1).">
      <Card><CardContent><ol className="recommendation-list">{topActions.map((r) => <li key={r.id} className="recommendation-row"><div className="recommendation-row-head"><strong>{r.title}</strong></div><p>{r.detail}</p></li>)}</ol></CardContent></Card>
    </PageSection>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Documents</CardTitle><CardDescription>See what is requested, uploaded, and verified.</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Keeping documents current speeds up every review. Only document details are shown — never file contents.</p></CardContent><CardFooter><Link href="/app/documents"><Button variant="outline">Open document center</Button></Link></CardFooter></Card>
      <Card><CardHeader><div><CardTitle>Consents</CardTitle><CardDescription>You stay in control of your data.</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Review purpose, scope, and validity of every consent — and revoke future access any time.</p></CardContent><CardFooter><Link href="/app/settings/consents"><Button variant="outline">Manage consents</Button></Link></CardFooter></Card>
    </TwoColumnGrid>
    <Card><CardHeader><div><CardTitle>Need help?</CardTitle><CardDescription>Raise a request — data issue, score question, or document help (owner-support-v1).</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Requests route to the support team with clear response times (SLA sla-v1). Notifications arrive in your preferred language (owner-notify-v1).</p></CardContent><CardFooter><Link href="/app/support-dashboard"><Button variant="outline">View support queue</Button></Link></CardFooter></Card>
  </div>;
}
