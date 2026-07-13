"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Central MSME registry — reference layout: search, four category tabs with counts, and the reference table
// columns (PAN/GSTIN, colored score, 12-month PD, risk-band chip, RM/branch, status, last updated) with numbered
// pagination and a rows-per-page selector. Role-gated through the API.
type Msme = { id: string; legalName: string; maskedPan: string; gstin: string; industry: string; state: string; branch: string; relationshipManager: string; segment: string; healthScore: number; healthBand: string; pd: number; pdBand: string; assessmentStatus: string; alertCount: number; lastAssessedAt: string };
type Payload = { msmes: Msme[]; summary: { total: number; ntc: number; ntb: number; existingToBank: number; thinFile: number } };
const headers = { "x-user-role": "bank_analyst" };
const BANDS = ["All", "Strong", "Healthy", "Watch", "Weak", "Critical"];
const BAND_VARIANT: Record<string, "success" | "warning"> = { Strong: "success", Healthy: "success" };
function scoreClass(score: number) { return score >= 65 ? "band-good" : score >= 50 ? "band-watch" : "band-risk"; }
export default function MsmeRegistryWorkspace() {
  const [data, setData] = useState<Payload | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "unauthorized">("loading");
  const [message, setMessage] = useState("");
  const [band, setBand] = useState("All");
  const [segment, setSegment] = useState("All");
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const query = useMemo(() => { const p = new URLSearchParams(); if (band !== "All") p.set("band", band); if (segment !== "All") p.set("segment", segment); if (alertsOnly) p.set("alertsOnly", "true"); if (search.trim()) p.set("search", search.trim()); return p.toString(); }, [band, segment, alertsOnly, search]);
  useEffect(() => { setPage(1); }, [query, pageSize]);
  useEffect(() => { let active = true; void fetch(`/api/v1/msme-registry${query ? `?${query}` : ""}`, { headers }).then(async (response) => { const result = await response.json(); if (!active) return; if (response.status === 403) return setState("unauthorized"); if (!response.ok) throw new Error(result.error?.message); setData(result.data); setState("ready"); }).catch((error: unknown) => { if (active) { setState("error"); setMessage(error instanceof Error ? error.message : "The registry is unavailable."); } }); return () => { active = false; }; }, [query]);
  if (state === "unauthorized") return <main className="state-panel error-state"><strong>Access unavailable</strong><span>You do not have permission to view the MSME registry.</span></main>;
  if (state === "error") return <main className="state-panel error-state"><strong>Registry unavailable</strong><span>{message}</span></main>;
  const pageCount = data ? Math.max(1, Math.ceil(data.msmes.length / pageSize)) : 1;
  const pageNumbers = (() => { if (pageCount <= 6) return Array.from({ length: pageCount }, (_, i) => i + 1); const set = new Set([1, 2, 3, page, pageCount]); return [...set].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b); })();
  return <div className="app-overview">
    <header className="page-header"><div><h1>MSME registry</h1><p>Every enterprise in the bank ecosystem — one canonical record each. Demonstration dataset.</p></div><Link href="/bank/msmes/new"><Button>+ Add MSME</Button></Link></header>
    <div className="registry-controls">
      <label className="registry-search">Search<input className="ui-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, PAN, GSTIN, Udyam, or branch…" /></label>
      <label>Risk band<select value={band} onChange={(e) => setBand(e.target.value)}>{BANDS.map((b) => <option key={b}>{b}</option>)}</select></label>
      <label className="check-label"><input type="checkbox" checked={alertsOnly} onChange={(e) => setAlertsOnly(e.target.checked)} />Active alerts only</label>
    </div>
    {data ? <div className="ui-tabs-list registry-category-tabs" role="tablist" aria-label="Customer category">{[["All", data.summary.total], ["NTC", data.summary.ntc], ["NTB", data.summary.ntb], ["EXISTING_TO_BANK", data.summary.existingToBank]].map(([key, count]) => <button key={String(key)} type="button" role="tab" aria-selected={segment === key} className={`ui-tabs-trigger ${segment === key ? "active" : ""}`} onClick={() => setSegment(String(key))}>{key === "EXISTING_TO_BANK" ? "Existing to Bank" : String(key)} ({count})</button>)}</div> : null}
    {state === "loading" || !data ? <main className="state-panel"><span className="spinner" aria-label="Loading" /><strong>Loading registry…</strong></main> : <Card><CardContent>
      <Table>
        <TableHeader><TableRow><TableHead>MSME name</TableHead><TableHead>PAN / GSTIN</TableHead><TableHead>Financial health score</TableHead><TableHead>12-month PD</TableHead><TableHead>Risk band</TableHead><TableHead>RM / Branch</TableHead><TableHead>Status</TableHead><TableHead>Last updated</TableHead></TableRow></TableHeader>
        <TableBody>{data.msmes.slice((page - 1) * pageSize, page * pageSize).map((m) => <TableRow key={m.id}>
          <TableCell><strong><Link href={`/bank/msmes/${m.id}`}>{m.legalName}</Link></strong></TableCell>
          <TableCell>{m.maskedPan}<br /><span className="metric-card-note">{m.gstin}</span></TableCell>
          <TableCell><span className={`score-num ${scoreClass(m.healthScore)}`}>{m.healthScore}</span></TableCell>
          <TableCell>{(m.pd * 100).toFixed(1)}%</TableCell>
          <TableCell><Badge variant={BAND_VARIANT[m.healthBand] ?? "warning"}>{m.healthBand}</Badge></TableCell>
          <TableCell>{m.relationshipManager}<br /><span className="metric-card-note">{m.branch}</span></TableCell>
          <TableCell><Badge variant={m.assessmentStatus === "FINAL" ? "success" : "outline"}>{m.assessmentStatus === "FINAL" ? "Active" : "Under Review"}</Badge></TableCell>
          <TableCell>{new Date(m.lastAssessedAt).toLocaleDateString("en-IN")}</TableCell>
        </TableRow>)}</TableBody>
      </Table>
      <div className="data-source-footer registry-pagination">
        <span className="metric-card-note">{data.msmes.length ? `${(page - 1) * pageSize + 1} to ${Math.min(page * pageSize, data.msmes.length)} of ${data.msmes.length}` : "0 results"}</span>
        <div className="page-buttons">{pageNumbers.map((n, i) => <span key={n}>{i > 0 && pageNumbers[i - 1] !== n - 1 ? <span className="metric-card-note">…</span> : null}<Button variant={n === page ? "default" : "outline"} onClick={() => setPage(n)}>{n}</Button></span>)}</div>
        <label className="rows-per-page">Rows per page<select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>{[8, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
    </CardContent></Card>}
  </div>;
}
