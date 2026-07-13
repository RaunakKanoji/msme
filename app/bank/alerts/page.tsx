import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listAllAlerts } from "@/lib/msme-registry/registry";
// Continuous-monitoring alerts across the portfolio (Section 18), severity-ordered.
export default function BankAlertsPage() {
  const alerts = listAllAlerts();
  return <div className="app-overview">
    <header className="page-header"><div><h1>Monitoring alerts</h1><p>Portfolio-wide alerts ordered by severity. Demonstration dataset.</p></div></header>
    <Card><CardContent>
      <Table>
        <TableHeader><TableRow><TableHead>Severity</TableHead><TableHead>Type</TableHead><TableHead>MSME</TableHead><TableHead>Detail</TableHead><TableHead>Raised</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>{alerts.map((a) => <TableRow key={a.id}>
          <TableCell><Badge variant={a.severity === "Critical" || a.severity === "High" ? "warning" : "outline"}>{a.severity}</Badge></TableCell>
          <TableCell>{a.type.replaceAll("_", " ")}</TableCell>
          <TableCell>{a.msmeName}</TableCell>
          <TableCell>{a.detail}</TableCell>
          <TableCell>{new Date(a.raisedAt).toLocaleDateString("en-IN")}</TableCell>
          <TableCell><Link href={`/bank/msmes/${a.msmeId}`}><Button variant="outline">Open MSME</Button></Link></TableCell>
        </TableRow>)}</TableBody>
      </Table>
    </CardContent></Card>
  </div>;
}
