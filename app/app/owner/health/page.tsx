import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialHealthScoreCard } from "@/components/cards/financial-health-score-card";
import { PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { ProviderUnavailableState } from "@/components/financial-data/states";
import type { DataSourceInfo } from "@/components/financial-data/data-source-badge";
import { getFinancialHealth } from "@/lib/financial-data/financial-data-service";
import { assessDefaultRisk } from "@/lib/default-risk/pd-engine";
import { formatPeriod } from "@/lib/financial-data/format";
// Owner health explainer (10-002/003/004): every pillar in plain language — what it measures, why it matters,
// what to do — plus the risk outlook explained honestly and the improvement plan. No model internals.
const PILLAR_MEANING: Record<string, { what: string; act: string }> = {
  "cash-flow-stability": { what: "How steady your money in and out is, month to month.", act: "Smooth out big swings by spacing payments and invoicing promptly." },
  "revenue-trend": { what: "Whether your earnings are growing, flat, or falling.", act: "Track your best-selling lines and repeat customers." },
  "debt-service": { what: "How comfortably your cash covers loan payments.", act: "Keep EMIs below what a slow month can still cover." },
  liquidity: { what: "The buffer you keep for surprises.", act: "Aim for at least one month of expenses in reserve (cash-buffer-v1)." },
  "expense-ratio": { what: "How much of every rupee earned gets spent.", act: "Review recurring costs quarterly." },
  "working-capital": { what: "Money available for day-to-day operations after near-term dues.", act: "Follow up receivables early — the collections pack can help (collections-v1)." },
};
export default async function OwnerHealthPage() {
  const session = await auth();
  const result = await getFinancialHealth({ businessId: `business_${session.orgId ?? "demo"}` });
  if (!result.ok) return <ProviderUnavailableState code={result.error.code} />;
  const { snapshot, health } = result.data;
  const pd = assessDefaultRisk(snapshot);
  const source = health.source as unknown as DataSourceInfo;
  return <div className="app-overview">
    <header className="page-header"><div><p className="breadcrumb"><Link href="/app/owner">Your business</Link> › <span>Understanding your score</span></p><h1>Understanding your score</h1></div><Link href="/app/financial-health"><Button variant="outline">Detailed analysis</Button></Link></header>
    <FinancialHealthScoreCard score={health.overallScore} category={health.category} description="Your score blends six everyday business signals. Here is what each one means and what you can do about it." reportingPeriod={formatPeriod(snapshot.periodStart, snapshot.periodEnd)} dataCompleteness={health.dataCompleteness} source={source} />
    <PageSection title="What each pillar means" description="Plain language only — no jargon (health-explainer-v1).">
      <TwoColumnGrid>{health.metrics.map((m) => <Card key={m.id}><CardHeader><div><CardTitle>{m.name}</CardTitle><CardDescription>Currently {m.formattedValue}</CardDescription></div><Badge variant={m.status === "good" ? "success" : "warning"}>{m.status === "good" ? "Going well" : m.status === "watch" ? "Worth watching" : "Needs attention"}</Badge></CardHeader><CardContent><p>{PILLAR_MEANING[m.id]?.what ?? m.explanation}</p><p className="metric-card-note">What you can do: {PILLAR_MEANING[m.id]?.act ?? "Keep your data connected so this stays current."}</p></CardContent></Card>)}</TwoColumnGrid>
    </PageSection>
    <Card><CardHeader><div><CardTitle>Your 12-month risk outlook: {(pd.probabilityOfDefault12M * 100).toFixed(1)}%</CardTitle><CardDescription>What this number is — and what it is not (risk-outlook-v1).</CardDescription></div><Badge variant={pd.probabilityOfDefault12M < 0.06 ? "success" : "warning"}>{pd.pdBand.replaceAll("_", " ")}</Badge></CardHeader><CardContent><p>This is an analytical outlook of how likely a serious repayment difficulty would be over the next 12 months, based on the information you have shared. It is <strong>not</strong> a credit decision, an offer, or a bureau score — and having no credit history does not count against you.{pd.status === "PROVISIONAL" ? " Because your history is still short, this outlook is provisional and will firm up as more months of data arrive." : ""}</p></CardContent></Card>
    <PageSection title="Your improvement plan" description="Built from your weakest pillars (improve-plan-v1).">
      <Card><CardContent><ol className="recommendation-list">{health.recommendations.map((r) => <li key={r.id} className="recommendation-row"><div className="recommendation-row-head"><strong>{r.title}</strong><Badge variant={r.priority === "high" ? "warning" : "outline"}>{r.priority} priority</Badge></div><p>{r.detail}</p></li>)}</ol></CardContent></Card>
    </PageSection>
  </div>;
}
