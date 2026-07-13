import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { store as tasksStore } from "@/lib/analyst-workbench/task-assignment";
import { store as queueStore } from "@/lib/platform-specs/rm-task-queue";
import { watchlist } from "@/lib/portfolio-monitoring/portfolio-analytics";
// RM task queue (21-002): live task register plus watchlist check-ins per rm-queue-v1 ordering.
export default function RmTaskQueuePage() {
  const tasks = tasksStore.list().records;
  const checkIns = watchlist().slice(0, 5);
  const policy = queueStore.list().records[0];
  return <div className="app-overview">
    <header className="page-header"><div><h1>RM task queue</h1><p>{policy.summary} Demonstration data.</p></div><Link href="/app/support-dashboard"><Button variant="outline">Support dashboard</Button></Link></header>
    <Card><CardContent>
      <Table>
        <TableHeader><TableRow><TableHead>Task</TableHead><TableHead>Detail</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {tasks.map((t) => <TableRow key={t.id}><TableCell><strong>{t.label}</strong></TableCell><TableCell>{t.summary}</TableCell><TableCell><Badge variant={t.status === "Adopted" ? "success" : "outline"}>{t.status === "Adopted" ? "Done" : "Open"}</Badge></TableCell></TableRow>)}
          {checkIns.map((m) => <TableRow key={m.id}><TableCell><strong>Watchlist check-in: {m.legalName}</strong></TableCell><TableCell>PD {(m.pd * 100).toFixed(1)}% · score {m.healthScore} · {m.branch}</TableCell><TableCell><Link href={`/bank/msmes/${m.id}`}><Button variant="outline">Open</Button></Link></TableCell></TableRow>)}
        </TableBody>
      </Table>
    </CardContent></Card>
  </div>;
}
