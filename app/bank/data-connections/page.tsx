import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProviderHealthStatus } from "@/lib/financial-data/financial-data-service";
import { listRegistry } from "@/lib/msme-registry/registry";
// Bank data-connections view: live provider health from the financial-data service plus portfolio-wide source
// coverage aggregated from the registry. No secrets or raw provider errors are shown.
export default async function BankDataConnectionsPage() {
  const provider = await getProviderHealthStatus();
  const all = listRegistry();
  const sources = ["ACCOUNT_AGGREGATOR", "GST", "UPI", "EPFO", "BUREAU"].map((source) => ({ source, count: all.filter((m) => m.connectedSources.includes(source)).length }));
  return <div className="app-overview">
    <header className="page-header"><div><h1>Data connections</h1><p>Provider health and portfolio-wide source coverage. Demonstration dataset.</p></div></header>
    <Card><CardHeader><div><CardTitle>Setu Account Aggregator</CardTitle><CardDescription>Financial-data provider status.</CardDescription></div><Badge variant={provider.providerMode === "mock" ? "outline" : provider.reachable ? "success" : "warning"}>{provider.providerMode === "mock" ? "Demo mode" : provider.configured ? (provider.reachable ? "Connected" : "Temporarily unavailable") : "Not configured"}</Badge></CardHeader><CardContent><ul className="kv-list"><li><span>Provider mode</span><strong>{provider.providerMode}</strong></li><li><span>Fallback</span><strong>{provider.fallbackEnabled ? "Enabled" : "Disabled"}</strong></li><li><span>Active fallback</span><strong>{provider.activeFallback ?? "None"}</strong></li></ul>{provider.message ? <p className="metric-card-note">{provider.message}</p> : null}</CardContent></Card>
    <Card><CardHeader><div><CardTitle>Portfolio source coverage</CardTitle><CardDescription>Connected data sources across {all.length} MSMEs.</CardDescription></div></CardHeader><CardContent>
      <Table><TableHeader><TableRow><TableHead>Source</TableHead><TableHead>Connected MSMEs</TableHead><TableHead>Coverage</TableHead></TableRow></TableHeader><TableBody>{sources.map((s) => <TableRow key={s.source}><TableCell><strong>{s.source.replaceAll("_", " ")}</strong></TableCell><TableCell>{s.count}</TableCell><TableCell>{Math.round((s.count / all.length) * 100)}%</TableCell></TableRow>)}</TableBody></Table>
    </CardContent></Card>
  </div>;
}
