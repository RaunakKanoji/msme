import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GovernanceRecord } from "@/lib/default-prediction/governance-store";
// Shared server-rendered viewer for policy/runbook governance records (batch 10-21 surfaces).
export function SpecRecordsPage({ title, description, records }: { title: string; description: string; records: GovernanceRecord[] }) {
  return <div className="app-overview">
    <header className="page-header"><div><h1>{title}</h1><p>{description} Demonstration data.</p></div></header>
    {records.map((r) => <Card key={r.id}><CardHeader><div><CardTitle>{r.label}</CardTitle><CardDescription>{r.version} · {r.owner}</CardDescription></div><Badge variant={r.status === "Adopted" ? "success" : r.status === "Draft" ? "outline" : "warning"}>{r.status}</Badge></CardHeader><CardContent><p>{r.summary}</p><p className="metric-card-note">{r.detail}</p></CardContent></Card>)}
  </div>;
}
