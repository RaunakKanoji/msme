import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard } from "@/components/cards/metric-card";
import { MetricGrid, PageSection, TwoColumnGrid } from "@/components/page/page-section";
import { portfolioSummary } from "@/lib/msme-registry/registry";
import { branchAnalytics, exposureSummary, segmentAnalytics, watchlist } from "@/lib/portfolio-monitoring/portfolio-analytics";
import { formatInrCompact } from "@/lib/financial-data/format";
// Portfolio monitoring dashboard (09-001/005/006/007): live aggregates from the shared registry. Demo data.
export default function PortfolioPage() {
  const s = portfolioSummary();
  const exposure = exposureSummary();
  const watch = watchlist();
  return <div className="app-overview">
    <header className="page-header"><div><h1>Portfolio monitoring</h1><p>Continuous risk view across the MSME portfolio. Demonstration dataset.</p></div><Link href="/app/watchlist"><Button>Open watchlist ({watch.length})</Button></Link></header>
    <MetricGrid columns={4}>
      <MetricCard title="MSMEs monitored" value={String(s.total)} status="neutral" description="Canonical registry records." />
      <MetricCard title="Portfolio PD" value={`${(s.portfolioPd * 100).toFixed(1)}%`} status={s.portfolioPd < 0.08 ? "positive" : "warning"} description="Mean predicted 12-month PD." />
      <MetricCard title="Total exposure" value={formatInrCompact(exposure.total)} status="neutral" description="Sum of outstanding liabilities (exposure-v1)." />
      <MetricCard title="Watchlist entries" value={String(watch.length)} status={watch.length ? "warning" : "positive"} description="Auto-entry per watchlist-v1 criteria." />
    </MetricGrid>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Segment risk</CardTitle><CardDescription>segment-risk-v1 — anonymized aggregates.</CardDescription></div></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Segment</TableHead><TableHead>Count</TableHead><TableHead>Avg score</TableHead><TableHead>Portfolio PD</TableHead><TableHead>Alerts</TableHead></TableRow></TableHeader><TableBody>{segmentAnalytics().map((r) => <TableRow key={r.segment}><TableCell><strong>{r.segment.replaceAll("_", " ")}</strong></TableCell><TableCell>{r.count}</TableCell><TableCell>{r.averageScore}</TableCell><TableCell>{(r.portfolioPd * 100).toFixed(1)}%</TableCell><TableCell>{r.alerts}</TableCell></TableRow>)}</TableBody></Table>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>Branch risk</CardTitle><CardDescription>branch-risk-v1 — highest portfolio PD first.</CardDescription></div></CardHeader><CardContent>
        <Table><TableHeader><TableRow><TableHead>Branch</TableHead><TableHead>Count</TableHead><TableHead>Avg score</TableHead><TableHead>Portfolio PD</TableHead><TableHead>Alerts</TableHead></TableRow></TableHeader><TableBody>{branchAnalytics().map((r) => <TableRow key={r.branch}><TableCell><strong>{r.branch}</strong></TableCell><TableCell>{r.count}</TableCell><TableCell>{r.averageScore}</TableCell><TableCell>{(r.portfolioPd * 100).toFixed(1)}%</TableCell><TableCell>{r.alerts}</TableCell></TableRow>)}</TableBody></Table>
      </CardContent></Card>
    </TwoColumnGrid>
    <PageSection title="Single-name concentration" description="Exposure above 5% of the portfolio (exposure-v1).">
      {exposure.concentrated.length ? <Card><CardContent><ul className="insight-list">{exposure.concentrated.map((e) => <li key={e.id} className="insight-row"><div className="insight-row-text"><strong><Link href={`/bank/msmes/${e.id}`}>{e.legalName}</Link></strong><span>{formatInrCompact(e.exposure)} outstanding</span></div><span className="insight-row-value trend-warning">{e.share}%</span></li>)}</ul></CardContent></Card> : <Card><CardContent><p className="metric-card-note">No single name exceeds 5% of portfolio exposure.</p></CardContent></Card>}
    </PageSection>
    <div className="info-banner"><strong>Demonstration data.</strong> Band-migration stress trends (stress-trend-v1) and cash-flow early-warning extensions activate once assessment history is persisted; current analytics aggregate the live seeded portfolio.</div>
  </div>;
}
