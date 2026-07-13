import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applicationSummary, IN_PROGRESS_STAGES, listApplications, type ApplicationStage } from "@/lib/msme-registry/applications";
import { formatInrCompact } from "@/lib/financial-data/format";
// Applications workspace (reference screen): KPI strip with conversion rate, status tabs with counts, enriched
// table (MSME + masked identifiers, stage chips, score chip, PD), GET-form search, link-based pagination.
const PAGE_SIZE = 10;
const TABS: Array<{ key: string; label: string; stages: ApplicationStage[] | null }> = [
  { key: "all", label: "All", stages: null },
  { key: "in-progress", label: "In Progress", stages: IN_PROGRESS_STAGES },
  { key: "approved", label: "Approved", stages: ["Approved"] },
  { key: "declined", label: "Declined", stages: ["Declined"] },
  { key: "closed", label: "Closed", stages: ["Closed"] },
];
const STAGE_VARIANT: Record<string, "success" | "warning" | "outline"> = { Approved: "success", Declined: "warning", "Information Requested": "warning" };
function scoreClass(score: number) { return score >= 65 ? "band-good" : score >= 50 ? "band-watch" : "band-risk"; }
export default async function BankApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  const params = await searchParams;
  const summary = applicationSummary();
  const active = TABS.find((t) => t.key === (params.status ?? "all")) ?? TABS[0];
  const q = (params.q ?? "").trim().toLowerCase();
  const all = listApplications();
  const filtered = all.filter((a) => (!active.stages || active.stages.includes(a.stage)) && (!q || `${a.id} ${a.msmeName} ${a.gstin}`.toLowerCase().includes(q)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.page) || 1), pageCount);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (overrides: Record<string, string | number | undefined>) => { const p = new URLSearchParams(); const merged = { status: active.key, q: params.q, page: undefined as string | number | undefined, ...overrides }; if (merged.status && merged.status !== "all") p.set("status", String(merged.status)); if (merged.q) p.set("q", String(merged.q)); if (merged.page && Number(merged.page) > 1) p.set("page", String(merged.page)); const s = p.toString(); return `/bank/applications${s ? `?${s}` : ""}`; };
  const tabCount = (t: (typeof TABS)[number]) => (t.stages ? all.filter((a) => t.stages!.includes(a.stage)).length : all.length);
  return <div className="app-overview">
    <header className="page-header"><div><h1>Applications</h1><p>Credit application pipeline across the MSME ecosystem. Demonstration dataset.</p></div></header>
    <div className="kpi-strip kpi-strip-6">
      <div className="kpi-tile"><span>Total applications</span><strong>{summary.total}</strong><small className="trend-neutral">across the portfolio</small></div>
      <div className="kpi-tile"><span>In progress</span><strong>{summary.inProgress}</strong><small className="trend-neutral">{Math.round((summary.inProgress / summary.total) * 100)}% of total</small></div>
      <div className="kpi-tile"><span>Approved</span><strong>{summary.approved}</strong><small className="trend-positive">sanction issued</small></div>
      <div className="kpi-tile"><span>Declined</span><strong>{summary.declined}</strong><small className="trend-warning">policy or risk</small></div>
      <div className="kpi-tile"><span>Closed</span><strong>{summary.closed}</strong><small className="trend-neutral">completed</small></div>
      <div className="kpi-tile"><span>Conversion rate</span><strong>{summary.conversionRate}%</strong><small className="trend-neutral">approved of decided</small></div>
    </div>
    <div className="ui-tabs-list registry-category-tabs" role="tablist" aria-label="Application status">{TABS.map((t) => <Link key={t.key} role="tab" aria-selected={t.key === active.key} className={`ui-tabs-trigger ${t.key === active.key ? "active" : ""}`} href={href({ status: t.key, page: undefined })}>{t.label} ({tabCount(t)})</Link>)}</div>
    <form method="get" action="/bank/applications" className="registry-controls"><input type="hidden" name="status" value={active.key} /><label>Search<input className="ui-input" name="q" defaultValue={params.q ?? ""} placeholder="ID, MSME name, or GSTIN" /></label><Button type="submit" variant="outline">Search</Button></form>
    <Card><CardContent>
      <p className="metric-card-note">{filtered.length ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}` : "0"} applications</p>
      <Table>
        <TableHeader><TableRow><TableHead>Application ID</TableHead><TableHead>MSME</TableHead><TableHead>Product</TableHead><TableHead>Requested amount</TableHead><TableHead>Stage</TableHead><TableHead>Assigned to</TableHead><TableHead>Health score</TableHead><TableHead>PD</TableHead><TableHead>Last updated</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>{rows.map((a) => <TableRow key={a.id}>
          <TableCell><strong>{a.id}</strong></TableCell>
          <TableCell><strong>{a.msmeName}</strong><br /><span className="metric-card-note">PAN: {a.maskedPan} · GSTIN: {a.gstin}</span></TableCell>
          <TableCell>{a.product}</TableCell>
          <TableCell>{formatInrCompact(a.amount)}</TableCell>
          <TableCell><Badge variant={STAGE_VARIANT[a.stage] ?? "outline"}>{a.stage}</Badge></TableCell>
          <TableCell>{a.assignedTo}</TableCell>
          <TableCell><span className={`score-num ${scoreClass(a.healthScore)}`}>{a.healthScore}</span> <span className="metric-card-note">{a.healthBand}</span></TableCell>
          <TableCell>{(a.pd * 100).toFixed(1)}%</TableCell>
          <TableCell>{new Date(a.updatedAt).toLocaleDateString("en-IN")}<br /><span className="metric-card-note">{new Date(a.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></TableCell>
          <TableCell><Link href={`/bank/msmes/${a.msmeId}`}><Button variant="outline">Open MSME</Button></Link></TableCell>
        </TableRow>)}</TableBody>
      </Table>
      {pageCount > 1 ? <div className="data-source-footer registry-pagination"><Link href={href({ page: page - 1 })} aria-disabled={page <= 1}><Button variant="outline" disabled={page <= 1}>Previous</Button></Link><span className="metric-card-note">Page {page} of {pageCount}</span><Link href={href({ page: page + 1 })} aria-disabled={page >= pageCount}><Button variant="outline" disabled={page >= pageCount}>Next</Button></Link></div> : null}
    </CardContent></Card>
  </div>;
}
