import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { TwoColumnGrid } from "@/components/page/page-section";
import { portfolioSummary } from "@/lib/msme-registry/registry";
import { applicationSummary } from "@/lib/msme-registry/applications";
// Bank reports: live portfolio snapshot figures plus an honest empty state for generated/downloadable reports.
export default function BankReportsPage() {
  const s = portfolioSummary();
  const a = applicationSummary();
  return <div className="app-overview">
    <header className="page-header"><div><h1>Reports</h1><p>Portfolio reporting built from the live demonstration dataset.</p></div></header>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Portfolio summary</CardTitle><CardDescription>Current portfolio position.</CardDescription></div></CardHeader><CardContent><ul className="kv-list"><li><span>Registered MSMEs</span><strong>{s.total}</strong></li><li><span>Average health score</span><strong>{s.averageScore}/100</strong></li><li><span>Portfolio PD</span><strong>{(s.portfolioPd * 100).toFixed(1)}%</strong></li><li><span>High-risk MSMEs</span><strong>{s.highRisk}</strong></li></ul></CardContent><CardFooter><Link href="/bank"><Button variant="outline">Open dashboard</Button></Link></CardFooter></Card>
      <Card><CardHeader><div><CardTitle>Working pipeline</CardTitle><CardDescription>Application throughput.</CardDescription></div></CardHeader><CardContent><ul className="kv-list"><li><span>Total applications</span><strong>{a.total}</strong></li><li><span>In progress</span><strong>{a.inProgress}</strong></li><li><span>Approved</span><strong>{a.approved}</strong></li><li><span>Conversion rate</span><strong>{a.conversionRate}%</strong></li></ul></CardContent><CardFooter><Link href="/bank/applications"><Button variant="outline">Open applications</Button></Link></CardFooter></Card>
    </TwoColumnGrid>
    <EmptyStateCard title="No downloadable reports generated yet" description="Exportable report generation (PDF/registry) is not yet part of this prototype. Generated reports will appear here with period, scope, and download actions." actionLabel="Review portfolio" actionHref="/bank" />
  </div>;
}
