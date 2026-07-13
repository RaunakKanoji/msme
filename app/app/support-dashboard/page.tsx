import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/cards/metric-card";
import { MetricGrid, TwoColumnGrid } from "@/components/page/page-section";
import { getProviderHealthStatus } from "@/lib/financial-data/financial-data-service";
import { listAllAlerts } from "@/lib/msme-registry/registry";
import { store as requestsStore } from "@/lib/platform-specs/borrower-service-requests";
import { store as slaStore } from "@/lib/platform-specs/sla-policy";
// Support dashboard (21-001): live queue tiles, provider health, request register, and SLA policy in one view.
export default async function SupportDashboardPage() {
  const provider = await getProviderHealthStatus();
  const alerts = listAllAlerts();
  const requests = requestsStore.list().records;
  const open = requests.filter((r) => r.status !== "Adopted").length;
  return <div className="app-overview">
    <header className="page-header"><div><h1>Support dashboard</h1><p>Operations queue, provider health, and SLA posture. Demonstration data.</p></div><Link href="/app/rm-task-queue"><Button variant="outline">RM task queue</Button></Link></header>
    <MetricGrid columns={4}>
      <MetricCard title="Open requests" value={String(open)} status={open ? "warning" : "positive"} description="Service requests awaiting resolution." />
      <MetricCard title="Portfolio alerts" value={String(alerts.length)} status="neutral" description="Feeding severity-based routing (pf-alerts-v1)." />
      <MetricCard title="Provider mode" value={provider.providerMode} status={provider.providerMode === "mock" ? "warning" : "positive"} description={provider.providerMode === "mock" ? "Demo fallback active." : "Live provider configured."} />
      <MetricCard title="Fallback" value={provider.fallbackEnabled ? "Enabled" : "Disabled"} status={provider.fallbackEnabled ? "positive" : "warning"} description="Never silent — labelled in every surface." />
    </MetricGrid>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Service requests</CardTitle><CardDescription>service-req-v1 register with SLA clocks.</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{requests.map((r) => <li key={r.id} className="insight-row"><div className="insight-row-text"><strong>{r.label}</strong><span>{r.summary}</span></div><Badge variant={r.status === "Adopted" ? "success" : "warning"}>{r.status === "Adopted" ? "Resolved" : "Open"}</Badge></li>)}</ul></CardContent></Card>
      <Card><CardHeader><div><CardTitle>SLA policy</CardTitle><CardDescription>Targets and escalation (sla-v1).</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{slaStore.list().records.map((r) => <li key={r.id} className="insight-row"><div className="insight-row-text"><strong>{r.label}</strong><span>{r.summary}</span></div><Badge variant={r.status === "Adopted" ? "success" : "outline"}>{r.status}</Badge></li>)}</ul><div className="button-row"><Link href="/app/ops-runbook"><Button variant="outline">Operations runbook</Button></Link><Link href="/app/post-incident-review"><Button variant="outline">Post-incident reviews</Button></Link></div></CardContent></Card>
    </TwoColumnGrid>
  </div>;
}
