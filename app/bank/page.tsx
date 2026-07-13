import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { listAllAlerts, listRegistry, portfolioSummary } from "@/lib/msme-registry/registry";
import { applicationsByStage, listApplications } from "@/lib/msme-registry/applications";
import { organizationDashboardStats } from "@/lib/msme-org/organization-store";
// Overview dashboard in the reference layout: KPI strip, health-score distribution donut, applications by stage,
// top risk alerts, recent onboarded MSMEs. Every figure comes from the shared engines; demonstration data.
const BAND_COLORS: Record<string, string> = { Strong: "#1e7f4f", Healthy: "#5eb377", Watch: "#e2a63c", Weak: "#e07a3f", Critical: "#c2402f" };
export default function BankDashboardPage() {
  const s = portfolioSummary();
  const o = organizationDashboardStats();
  const stages = applicationsByStage();
  const totalApps = listApplications().length;
  const maxStage = Math.max(1, ...stages.map((x) => x.count));
  const alerts = listAllAlerts().slice(0, 5);
  const recent = [...listRegistry()].sort((a, b) => (a.onboardedAt < b.onboardedAt ? 1 : -1)).slice(0, 5);
  const donutSegments = Object.entries(s.byBand);
  let acc = 0;
  const gradient = donutSegments.map(([band, count]) => { const from = (acc / s.total) * 360; acc += count; const to = (acc / s.total) * 360; return `${BAND_COLORS[band]} ${from}deg ${to}deg`; }).join(", ");
  return <div className="app-overview">
    <header className="page-header"><div><h1>Overview dashboard</h1><p>Bank-wide MSME ecosystem at a glance. Demonstration dataset — clearly labelled, never presented as live.</p></div><Link href="/bank/msmes/new"><Button>Add MSME</Button></Link></header>
    <div className="kpi-strip">
      <div className="kpi-tile"><span>Total MSMEs</span><strong>{s.total}</strong><small className="trend-positive">{o.verified} verified</small></div>
      <div className="kpi-tile"><span>Active MSMEs</span><strong>{s.total - o.incompleteOnboarding}</strong><small className="trend-neutral">{o.incompleteOnboarding} in onboarding</small></div>
      <div className="kpi-tile"><span>Applications</span><strong>{totalApps}</strong><small className="trend-neutral">{stages.find((x) => x.stage === "Under Review")?.count ?? 0} under review</small></div>
      <div className="kpi-tile"><span>High-risk alerts</span><strong>{s.highRisk}</strong><small className="trend-warning">requires attention</small></div>
      <div className="kpi-tile"><span>Avg financial health score</span><strong>{s.averageScore}</strong><small className={s.averageScore >= 65 ? "trend-positive" : "trend-warning"}>{s.averageScore >= 65 ? "Good" : "Watch"} · PD {(s.portfolioPd * 100).toFixed(1)}%</small></div>
    </div>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>MSME health score distribution</CardTitle><CardDescription>Configurable band cut-offs (health-bands-v1).</CardDescription></div></CardHeader><CardContent>
        <div className="donut-wrap">
          <div className="donut" style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={donutSegments.map(([b, c]) => `${b}: ${c}`).join(", ")} />
          <ul className="donut-legend">{donutSegments.map(([band, count]) => <li key={band}><i style={{ background: BAND_COLORS[band] }} />{band}<em>{Math.round((count / s.total) * 100)}% · {count}</em></li>)}</ul>
        </div>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>Applications by stage</CardTitle><CardDescription>{totalApps} applications in the pipeline.</CardDescription></div><Link href="/bank/applications"><Button variant="outline">View all</Button></Link></CardHeader><CardContent>
        <div className="stage-rows">{stages.map((row) => <div key={row.stage} className="stage-row"><span>{row.stage}</span><div className="stage-track"><div className="stage-fill" style={{ width: `${Math.round((row.count / maxStage) * 100)}%` }} /></div><strong>{row.count}</strong></div>)}</div>
      </CardContent></Card>
    </TwoColumnGrid>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Top risk alerts</CardTitle><CardDescription>{s.withAlerts} MSMEs currently carry alerts.</CardDescription></div><Link href="/bank/alerts"><Button variant="outline">View all</Button></Link></CardHeader><CardContent><ul className="insight-list">{alerts.map((a) => <li key={a.id} className="insight-row"><div className="insight-row-text"><strong>{a.type.replaceAll("_", " ")}</strong><span>{a.msmeName}</span></div><Badge variant={a.severity === "Critical" || a.severity === "High" ? "warning" : "outline"}>{a.severity}</Badge></li>)}</ul></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Recent onboarded MSMEs</CardTitle><CardDescription>Latest additions to the ecosystem.</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{recent.map((m) => <li key={m.id} className="insight-row"><div className="insight-row-text"><strong><Link href={`/bank/msmes/${m.id}`}>{m.legalName}</Link></strong><span>{m.state} · {new Date(m.onboardedAt).toLocaleDateString("en-IN")}</span></div><span className="insight-row-value">{m.healthScore}<em>score</em></span></li>)}</ul></CardContent></Card>
    </TwoColumnGrid>
    <PageSection title="Onboarding pipeline" description="How organizations entered the ecosystem and where they stand.">
      <div className="kpi-strip">
        <div className="kpi-tile"><span>Verified</span><strong>{o.verified}</strong><small className="trend-neutral">{o.awaitingVerification} awaiting</small></div>
        <div className="kpi-tile"><span>Bank-created</span><strong>{o.bankCreated}</strong><small className="trend-neutral">manual onboarding</small></div>
        <div className="kpi-tile"><span>Self-onboarded</span><strong>{o.selfOnboarded}</strong><small className="trend-neutral">customer app</small></div>
        <div className="kpi-tile"><span>Bulk-imported</span><strong>{o.bulkImported}</strong><small className="trend-neutral">batch files</small></div>
        <div className="kpi-tile"><span>Ready for assessment</span><strong>{o.readyForAssessment}</strong><small className="trend-positive">data connected</small></div>
      </div>
    </PageSection>
  </div>;
}
