import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listApplications } from "@/lib/msme-registry/applications";
import { formatInrCompact } from "@/lib/financial-data/format";
// Credit applications pipeline (reference "Applications" screen): one table over the deterministic demo pipeline.
export default function BankApplicationsPage() {
  const apps = listApplications();
  return <div className="app-overview">
    <header className="page-header"><div><h1>Applications</h1><p>{apps.length} credit applications in the pipeline. Demonstration dataset.</p></div></header>
    <Card><CardContent>
      <Table>
        <TableHeader><TableRow><TableHead>Application ID</TableHead><TableHead>MSME</TableHead><TableHead>Product</TableHead><TableHead>Amount</TableHead><TableHead>Stage</TableHead><TableHead>Assigned to</TableHead><TableHead>Last updated</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>{apps.map((a) => <TableRow key={a.id}>
          <TableCell><strong>{a.id}</strong></TableCell>
          <TableCell>{a.msmeName}</TableCell>
          <TableCell>{a.product}</TableCell>
          <TableCell>{formatInrCompact(a.amount)}</TableCell>
          <TableCell><Badge variant={a.stage === "Approved" ? "success" : a.stage === "Declined" ? "warning" : "outline"}>{a.stage}</Badge></TableCell>
          <TableCell>{a.assignedTo}</TableCell>
          <TableCell>{new Date(a.updatedAt).toLocaleDateString("en-IN")}</TableCell>
          <TableCell><Link href={`/bank/msmes/${a.msmeId}`}><Button variant="outline">Open MSME</Button></Link></TableCell>
        </TableRow>)}</TableBody>
      </Table>
    </CardContent></Card>
  </div>;
}
