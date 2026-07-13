import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard } from "@/components/cards/metric-card";
import { MetricGrid, PageSection } from "@/components/page/page-section";
import { applicationSummary, IN_PROGRESS_STAGES, listApplications } from "@/lib/msme-registry/applications";
import { formatInrCompact } from "@/lib/financial-data/format";
// Analyst workbench dashboard (08-001/08-002): queue tiles + review queue ordered per queue-v1 (overdue-equivalent
// first via PD descending within in-progress stages). Live shared stores; demonstration data.
export default function AnalystDashboardPage() {
  const summary = applicationSummary();
  const queue = listApplications().filter((a) => IN_PROGRESS_STAGES.includes(a.stage)).sort((a, b) => b.pd - a.pd).slice(0, 12);
  return <div className="app-overview">
    <header className="page-header"><div><h1>Analyst workbench</h1><p>Review queue and portfolio snapshot. Demonstration dataset.</p></div></header>
    <MetricGrid columns={4}>
      <MetricCard title="In review queue" value={String(summary.inProgress)} status="neutral" description="Applications in progress stages." />
      <MetricCard title="High-PD in queue" value={String(queue.filter((a) => a.pd >= 0.12).length)} status="warning" description="PD 12%+ — review first (queue-v1)." />
      <MetricCard title="Approved" value={String(summary.approved)} status="positive" description="This period." />
      <MetricCard title="Conversion" value={`${summary.conversionRate}%`} status="neutral" description="Approved of decided." />
    </MetricGrid>
    <PageSection title="Review queue" description="Ordered by risk (PD descending) per queue-v1.">
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Application</TableHead><TableHead>MSME</TableHead><TableHead>Amount</TableHead><TableHead>Stage</TableHead><TableHead>Score</TableHead><TableHead>PD</TableHead><TableHead>Assigned</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>{queue.map((a) => <TableRow key={a.id}>
            <TableCell><strong>{a.id}</strong><br /><span className="metric-card-note">{a.product}</span></TableCell>
            <TableCell>{a.msmeName}</TableCell>
            <TableCell>{formatInrCompact(a.amount)}</TableCell>
            <TableCell><Badge variant="outline">{a.stage}</Badge></TableCell>
            <TableCell><span className={`score-num ${a.healthScore >= 65 ? "band-good" : a.healthScore >= 50 ? "band-watch" : "band-risk"}`}>{a.healthScore}</span></TableCell>
            <TableCell>{(a.pd * 100).toFixed(1)}%</TableCell>
            <TableCell>{a.assignedTo}</TableCell>
            <TableCell><Link href={`/app/analyst/applications/${a.id}`}><Button variant="outline">Open</Button></Link></TableCell>
          </TableRow>)}</TableBody>
        </Table>
      </CardContent></Card>
    </PageSection>
  </div>;
}
