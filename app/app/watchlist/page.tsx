import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { watchlist } from "@/lib/portfolio-monitoring/portfolio-analytics";
// Watchlist (09-002/003): auto-entries per watchlist-v1 (PD 12%+, health < 45, or Critical band), ordered by PD.
export default function WatchlistPage() {
  const entries = watchlist();
  return <div className="app-overview">
    <header className="page-header"><div><h1>Watchlist</h1><p>{entries.length} MSMEs meeting watchlist-v1 entry criteria — exit requires two improved assessments and reviewer sign-off. Demonstration dataset.</p></div><Link href="/app/portfolio"><Button variant="outline">Portfolio view</Button></Link></header>
    <Card><CardContent>
      <Table>
        <TableHeader><TableRow><TableHead>MSME</TableHead><TableHead>Entry reason</TableHead><TableHead>Score</TableHead><TableHead>PD</TableHead><TableHead>Band</TableHead><TableHead>Alerts</TableHead><TableHead>RM / Branch</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>{entries.map((m) => <TableRow key={m.id}>
          <TableCell><strong>{m.legalName}</strong></TableCell>
          <TableCell><span className="metric-card-note">{m.pd >= 0.12 ? "Elevated PD" : m.healthScore < 45 ? "Weak health score" : "Critical band"}</span></TableCell>
          <TableCell><span className={`score-num ${m.healthScore >= 50 ? "band-watch" : "band-risk"}`}>{m.healthScore}</span></TableCell>
          <TableCell>{(m.pd * 100).toFixed(1)}%</TableCell>
          <TableCell><Badge variant="warning">{m.healthBand}</Badge></TableCell>
          <TableCell>{m.alertCount}</TableCell>
          <TableCell>{m.relationshipManager}<br /><span className="metric-card-note">{m.branch}</span></TableCell>
          <TableCell><Link href={`/bank/msmes/${m.id}`}><Button variant="outline">Open</Button></Link></TableCell>
        </TableRow>)}</TableBody>
      </Table>
    </CardContent></Card>
    <div className="info-banner"><strong>Reviewer-controlled exits.</strong> Watchlist exits and collection handoffs (handoff-v1) require reviewer confirmation and are audit-logged — never automatic on a single assessment.</div>
  </div>;
}
