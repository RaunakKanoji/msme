"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Central MSME registry (Section 4.1/4.2): one table over the canonical records with the core filters. Role-gated
// through the API; borrower roles receive a safe denial.
type Msme = { id: string; legalName: string; gstin: string; industry: string; state: string; branch: string; relationshipManager: string; segment: string; healthScore: number; healthBand: string; pd: number; pdBand: string; assessmentStatus: string; connectedSources: string[]; alertCount: number };
type Payload = { msmes: Msme[]; summary: { total: number; ntc: number; ntb: number; existingToBank: number; thinFile: number } };
const headers = { "x-user-role": "bank_analyst" };
const BANDS = ["All", "Strong", "Healthy", "Watch", "Weak", "Critical"];
const PAGE_SIZE = 8;
export default function MsmeRegistryWorkspace() {
  const [data, setData] = useState<Payload | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "unauthorized">("loading");
  const [message, setMessage] = useState("");
  const [band, setBand] = useState("All");
  const [segment, setSegment] = useState("All");
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useMemo(() => { const p = new URLSearchParams(); if (band !== "All") p.set("band", band); if (segment !== "All") p.set("segment", segment); if (alertsOnly) p.set("alertsOnly", "true"); if (search.trim()) p.set("search", search.trim()); return p.toString(); }, [band, segment, alertsOnly, search]);
  useEffect(() => { setPage(1); }, [query]);
  useEffect(() => { let active = true; void fetch(`/api/v1/msme-registry${query ? `?${query}` : ""}`, { headers }).then(async (response) => { const result = await response.json(); if (!active) return; if (response.status === 403) return setState("unauthorized"); if (!response.ok) throw new Error(result.error?.message); setData(result.data); setState("ready"); }).catch((error: unknown) => { if (active) { setState("error"); setMessage(error instanceof Error ? error.message : "The registry is unavailable."); } }); return () => { active = false; }; }, [query]);
  if (state === "unauthorized") return <main className="state-panel error-state"><strong>Access unavailable</strong><span>You do not have permission to view the MSME registry.</span></main>;
  if (state === "error") return <main className="state-panel error-state"><strong>Registry unavailable</strong><span>{message}</span></main>;
  return <div className="app-overview">
    <header className="page-header"><div><h1>MSME registry</h1><p>Every enterprise in the bank ecosystem — one canonical record each. Demonstration dataset.</p></div><Link href="/bank/msmes/new"><Button>Add MSME</Button></Link></header>
    {data ? <div className="ui-tabs-list registry-category-tabs" role="tablist" aria-label="Customer category">{[["All", data.summary.total], ["NTC", data.summary.ntc], ["NTB", data.summary.ntb], ["EXISTING_TO_BANK", data.summary.existingToBank], ["THIN_FILE", data.summary.thinFile]].map(([key, count]) => <button key={String(key)} type="button" role="tab" aria-selected={segment === key} className={`ui-tabs-trigger ${segment === key ? "active" : ""}`} onClick={() => setSegment(String(key))}>{String(key).replaceAll("_", " ")} ({count})</button>)}</div> : null}
    <div className="address-controls registry-controls">
      <label>Search<input className="ui-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, ID, or GSTIN" /></label>
      <label>Risk band<select value={band} onChange={(e) => setBand(e.target.value)}>{BANDS.map((b) => <option key={b}>{b}</option>)}</select></label>
      <label className="check-label"><input type="checkbox" checked={alertsOnly} onChange={(e) => setAlertsOnly(e.target.checked)} />Active alerts only</label>
    </div>
    {state === "loading" || !data ? <main className="state-panel"><span className="spinner" aria-label="Loading" /><strong>Loading registry…</strong></main> : <Card><CardContent>
      <p className="metric-card-note">{data.msmes.length ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, data.msmes.length)} of ${data.msmes.length}` : "0"} matching · {data.summary.total} total</p>
      <Table>
        <TableHeader><TableRow><TableHead>MSME</TableHead><TableHead>Industry / state</TableHead><TableHead>Segment</TableHead><TableHead>Health score</TableHead><TableHead>12-month PD</TableHead><TableHead>Alerts</TableHead><TableHead>RM / branch</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>{data.msmes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((m) => <TableRow key={m.id}>
          <TableCell><strong>{m.legalName}</strong><br /><span className="metric-card-note">{m.id} · {m.gstin}</span></TableCell>
          <TableCell>{m.industry}<br /><span className="metric-card-note">{m.state}</span></TableCell>
          <TableCell><Badge variant="outline">{m.segment.replaceAll("_", " ")}</Badge>{m.assessmentStatus === "PROVISIONAL" ? <><br /><span className="metric-card-note">Provisional</span></> : null}</TableCell>
          <TableCell><strong>{m.healthScore}</strong>/100 <Badge variant={m.healthBand === "Strong" || m.healthBand === "Healthy" ? "success" : "warning"}>{m.healthBand}</Badge></TableCell>
          <TableCell>{(m.pd * 100).toFixed(1)}%<br /><span className="metric-card-note">{m.pdBand.replaceAll("_", " ")}</span></TableCell>
          <TableCell>{m.alertCount ? <Badge variant="warning">{m.alertCount}</Badge> : <span className="metric-card-note">None</span>}</TableCell>
          <TableCell>{m.relationshipManager}<br /><span className="metric-card-note">{m.branch}</span></TableCell>
          <TableCell><Link href={`/bank/msmes/${m.id}`}><Button variant="outline">Open</Button></Link></TableCell>
        </TableRow>)}</TableBody>
      </Table>
      {data.msmes.length > PAGE_SIZE ? <div className="data-source-footer registry-pagination"><Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button><span className="metric-card-note">Page {page} of {Math.ceil(data.msmes.length / PAGE_SIZE)}</span><Button variant="outline" disabled={page >= Math.ceil(data.msmes.length / PAGE_SIZE)} onClick={() => setPage((p) => p + 1)}>Next</Button></div> : null}
    </CardContent></Card>}
  </div>;
}
