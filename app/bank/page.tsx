import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { RefreshButton } from "@/components/bank/refresh-button";
import { listAllAlerts, listRegistry, portfolioSummary } from "@/lib/msme-registry/registry";
import { applicationSummary, applicationsByStage, type ApplicationStage } from "@/lib/msme-registry/applications";
import { organizationDashboardStats } from "@/lib/msme-org/organization-store";
import { HEALTH_BAND_CONFIG } from "@/lib/default-risk/risk-bands";
// Overview dashboard in the reference layout: KPI tiles with derived deltas, health-score distribution donut with
// band ranges, five-stage application bars, severity-dotted risk-alert aggregates, and an onboarded-MSMEs table.
// Every figure is derived from the shared engines and stores; demonstration data throughout.
const BAND_COLORS: Record<string, string> = { Strong: "#1e7f4f", Healthy: "#5eb377", Watch: "#e2a63c", Weak: "#e07a3f", Critical: "#c2402f" };
const ALERT_DOT: Record<string, string> = { SCORE_DETERIORATION: "#c2402f", PD_INCREASE: "#c2402f", RISK_INDICATOR: "#e07a3f", THIN_FILE: "#e2a63c" };
const STAGE_BARS: Array<{ label: string; stages: ApplicationStage[] }> = [
  { label: "Application Received", stages: ["Application Received"] },
  { label: "Under Review", stages: ["Under Review", "Underwriting", "Risk Assessment"] },
  { label: "Information Requested", stages: ["Information Requested"] },
  { label: "Approved", stages: ["Approved"] },
  { label: "Declined", stages: ["Declined"] },
];
function scoreChipClass(score: number) { return score >= 65 ? "chip-good" : score >= 50 ? "chip-watch" : "chip-risk"; }
export default function BankDashboardPage() {
  const s = portfolioSummary();
  const o = organizationDashboardStats();
  const apps = applicationSummary();
  const stageCounts = applicationsByStage();
  const bars = STAGE_BARS.map((bar) => ({ label: bar.label, count: bar.stages.reduce((sum, st) => sum + (stageCounts.find((x) => x.stage === st)?.count ?? 0), 0) }));
  const maxBar = Math.max(1, ...bars.map((b) => b.count));
  // Derived "vs last month" deltas: share of organizations onboarded in the most recent seeded month.
  const registry = listRegistry();
  const latestMonth = registry.map((m) => m.onboardedAt.slice(0, 7)).sort().at(-1);
  const onboardedLatest = registry.filter((m) => m.onboardedAt.startsWith(latestMonth ?? "")).length;
  const growthPct = ((onboardedLatest / Math.max(1, s.total - onboardedLatest)) * 100).toFixed(1);
  const alertTypes = Object.entries(listAllAlerts().reduce<Record<string, number>>((acc, a) => { acc[a.type] = (acc[a.type] ?? 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const recent = [...registry].sort((a, b) => (a.onboardedAt < b.onboardedAt ? 1 : -1)).slice(0, 5);
  return <div className="app-overview">
    <header className="page-header"><div><h1>Overview dashboard</h1><p>Bank-wide MSME ecosystem at a glance. Demonstration dataset.</p></div><RefreshButton /></header>
    <div className="kpi-strip">
      <div className="kpi-tile"><span>Total MSMEs</span><strong>{s.total}</strong><small className="trend-positive">▲ {growthPct}% vs last month</small></div>
      <div className="kpi-tile"><span>Active MSMEs</span><strong>{s.total - o.incompleteOnboarding}</strong><small className="trend-positive">▲ {o.readyForAssessment} ready for assessment</small></div>
      <div className="kpi-tile"><span>Applications</span><strong>{apps.total}</strong><small className="trend-neutral">{apps.inProgress} in progress</small></div>
      <div className="kpi-tile"><span>High-risk alerts</span><strong>{s.highRisk}</strong><small className="trend-warning">Requires attention</small></div>
      <div className="kpi-tile"><span>Avg. financial health score</span><strong>{s.averageScore} <em className="kpi-denominator">/100</em></strong><small><span className={`score-chip ${scoreChipClass(s.averageScore)}`}>{s.averageScore >= 65 ? "Good" : "Watch"}</span></small></div>
    </div>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>MSME health score distribution</CardTitle></div></CardHeader><CardContent>
        <div className="donut-wrap">
          <div className="donut" style={{ background: `conic-gradient(${(() => { let acc = 0; return Object.entries(s.byBand).map(([band, count]) => { const from = (acc / s.total) * 360; acc += count; return `${BAND_COLORS[band]} ${from}deg ${(acc / s.total) * 360}deg`; }).join(", "); })()})` }} role="img" aria-label={Object.entries(s.byBand).map(([b, c]) => `${b}: ${c}`).join(", ")} />
          <ul className="donut-legend">{HEALTH_BAND_CONFIG.bands.map((band) => <li key={band.name}><i style={{ background: BAND_COLORS[band.name] }} />{band.name} ({band.min}–{band.max})<em>{Math.round(((s.byBand[band.name] ?? 0) / s.total) * 100)}%</em></li>)}</ul>
        </div>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>Applications by stage</CardTitle></div><Link href="/bank/applications"><Button variant="outline">View all</Button></Link></CardHeader><CardContent>
        <div className="stage-rows">{bars.map((row) => <div key={row.label} className="stage-row"><span>{row.label}</span><div className="stage-track"><div className="stage-fill" style={{ width: `${Math.round((row.count / maxBar) * 100)}%` }} /></div><strong>{row.count}</strong></div>)}</div>
      </CardContent></Card>
    </TwoColumnGrid>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Top risk alerts</CardTitle></div><Link href="/bank/alerts"><Button variant="outline">View all</Button></Link></CardHeader><CardContent><ul className="insight-list">{alertTypes.map(([type, count]) => <li key={type} className="insight-row"><div className="insight-row-text alert-type-row"><i className="severity-dot" style={{ background: ALERT_DOT[type] ?? "#e2a63c" }} /><strong>{type.replaceAll("_", " ")}</strong></div><span className="insight-row-value">{count}</span></li>)}</ul></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Recently onboarded MSMEs</CardTitle></div></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>MSME name</TableHead><TableHead>Industry</TableHead><TableHead>Financial health score</TableHead><TableHead>Onboarded on</TableHead></TableRow></TableHeader><TableBody>{recent.map((m) => <TableRow key={m.id}><TableCell><strong><Link href={`/bank/msmes/${m.id}`}>{m.legalName}</Link></strong></TableCell><TableCell>{m.industry}</TableCell><TableCell><span className={`score-chip ${scoreChipClass(m.healthScore)}`}>{m.healthScore}</span></TableCell><TableCell>{new Date(m.onboardedAt).toLocaleDateString("en-IN")}</TableCell></TableRow>)}</TableBody></Table>
      </CardContent></Card>
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
