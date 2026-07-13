"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/cards/metric-card";
import { MetricGrid, TwoColumnGrid } from "@/components/page/page-section";
import { formatInrCompact, formatPeriod } from "@/lib/financial-data/format";
import { cardStatus } from "@/lib/financial-data/presentation";
import type { FinancialHealthResult } from "@/lib/financial-data/types";
// MSME 360 profile (Section 4.3, prototype subset of tabs): Overview / Identity / Health score / Default risk /
// Alerts. One unified health score; PD shown separately with model + definition versions.
type Detail = {
  msme: { id: string; legalName: string; tradingName: string; maskedPan: string; gstin: string; udyam: string; constitution: string; industry: string; nicCode: string; vintageYears: number; state: string; branch: string; relationshipManager: string; employees: number; segment: string; healthScore: number; healthBand: string; pd: number; pdBand: string; assessmentStatus: string; connectedSources: string[]; lastAssessedAt: string; onboardedAt: string };
  health: FinancialHealthResult;
  defaultRisk: { probabilityOfDefault12M: number; pdBand: string; segment: string; status: string; modelVersion: string; definitionVersion: string; factors: Array<{ code: string; points: number; detail: string }> };
  alerts: Array<{ id: string; severity: string; type: string; detail: string; raisedAt: string }>;
  applications: ProfileApplication[];
  snapshotSummary: { accounts: number; transactions: number; monthlyRevenue: number; monthlyExpenses: number; netCashFlow: number; averageBalance: number; liabilities: number; debtObligations: number; periodStart: string; periodEnd: string };
};
type ProfileApplication = { id: string; product: string; amount: number; stage: string; assignedTo: string; updatedAt: string };
type OrgBundle = {
  organization: { maskedPan: string; onboardingSource: string; onboardingStatus: string; verificationStatus: string; customerCategory: string; contactEmail?: string };
  memberships: Array<{ id: string; userEmail: string; role: string; ownershipPercentage?: number; authorizationStatus: string }>;
  assignments: Array<{ id: string; branchId: string; relationshipManagerId: string; assignedAt: string; endedAt?: string; current: boolean }>;
  statusHistory: Array<{ id: string; from: string | null; to: string; actor: string; at: string; note?: string }>;
};
const headers = { "x-user-role": "bank_analyst" };
export default function MsmeProfileWorkspace({ msmeId }: { msmeId: string }) {
  const [data, setData] = useState<Detail | null>(null);
  const [org, setOrg] = useState<OrgBundle | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "unauthorized">("loading");
  const [message, setMessage] = useState("");
  useEffect(() => { let active = true; void Promise.all([fetch(`/api/v1/msme-registry/${msmeId}`, { headers }), fetch(`/api/v1/bank/msme-organizations/org_${msmeId}`, { headers })]).then(async ([registryRes, orgRes]) => { const result = await registryRes.json(); if (!active) return; if (registryRes.status === 403) return setState("unauthorized"); if (!registryRes.ok) throw new Error(result.error?.message); setData(result.data); if (orgRes.ok) setOrg((await orgRes.json()).data as OrgBundle); setState("ready"); }).catch((error: unknown) => { if (active) { setState("error"); setMessage(error instanceof Error ? error.message : "The MSME record is unavailable."); } }); return () => { active = false; }; }, [msmeId]);
  if (state === "unauthorized") return <main className="state-panel error-state"><strong>Access unavailable</strong><span>You do not have permission to view this MSME.</span></main>;
  if (state === "error") return <main className="state-panel error-state"><strong>MSME unavailable</strong><span>{message}</span></main>;
  if (state === "loading" || !data) return <main className="state-panel"><span className="spinner" aria-label="Loading" /><strong>Loading MSME profile…</strong></main>;
  const { msme, health, defaultRisk, alerts, snapshotSummary: snap } = data;
  return <div className="app-overview">
    <header className="page-header"><div><p className="breadcrumb"><Link href="/bank/msmes">MSME Registry</Link> › <span>{msme.legalName}</span></p><h1>MSME 360° profile</h1></div><div className="button-row"><Link href={`/bank/msmes/${msme.id}/health-card`}><Button>Open health card</Button></Link><Link href="/bank/msmes"><Button variant="outline">Back to registry</Button></Link></div></header>
    <div className="profile-head-grid">
      <Card><CardContent className="identity-card"><h2>{msme.legalName} <Badge variant={msme.healthScore >= 50 ? "success" : "warning"}>{msme.assessmentStatus === "PROVISIONAL" ? "Provisional" : "Active"}</Badge></h2><div className="identity-strip"><span>PAN<strong>{org?.organization.maskedPan ?? msme.maskedPan}</strong></span><span>GSTIN<strong>{msme.gstin}</strong></span><span>Udyam<strong>{msme.udyam}</strong></span><span>Constitution<strong>{msme.constitution}</strong></span><span>Established<strong>{new Date(msme.onboardedAt).toLocaleDateString("en-IN")}</strong></span></div></CardContent></Card>
      <Card><CardContent className="score-panel"><span className="metric-card-label">Financial health score</span><div className="score-card-value"><span className="score-card-number">{msme.healthScore}</span><span className="score-card-denominator">/100</span></div><Badge variant={msme.healthScore >= 65 ? "success" : "warning"}>{msme.healthBand}</Badge><span className="score-chip chip-good">▲ 6 pts vs last assessment</span><p className="metric-card-note">Updated on {new Date(msme.lastAssessedAt).toLocaleDateString("en-IN")} · 12-month PD {(msme.pd * 100).toFixed(1)}%</p></CardContent></Card>
    </div>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Key highlights</CardTitle></div></CardHeader><CardContent><ul className="kv-list"><li><span>Business activity</span><strong>{msme.industry} — {snap.transactions} transactions analysed</strong></li><li><span>Industry</span><strong>{msme.industry}</strong></li><li><span>Annual turnover</span><strong>{formatInrCompact(snap.monthlyRevenue * 12)}</strong></li><li><span>Employees</span><strong>{msme.employees}</strong></li><li><span>Credit exposure</span><strong>{formatInrCompact(snap.liabilities)}</strong></li><li><span>GST return filing</span><strong>{msme.assessmentStatus === "FINAL" ? "Regular" : "Needs review"}</strong></li><li><span>Home branch</span><strong>{msme.branch}</strong></li><li><span>Relationship manager</span><strong>{msme.relationshipManager}</strong></li><li><span>Banker since</span><strong>{new Date(msme.onboardedAt).toLocaleDateString("en-IN")}</strong></li><li><span>Internal grade</span><strong>{msme.healthBand} ({msme.segment.replaceAll("_", " ")})</strong></li></ul></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Alerts ({alerts.length})</CardTitle></div></CardHeader><CardContent>{alerts.length ? <div className="alert-tiles">{alerts.slice(0, 3).map((a) => <div key={a.id} className="alert-tile"><div className="alert-tile-head"><i className="severity-dot" style={{ background: a.severity === "Critical" || a.severity === "High" ? "#c2402f" : "#e2a63c" }} /><strong>{a.type.replaceAll("_", " ")}</strong><span className="metric-card-note">{new Date(a.raisedAt).toLocaleDateString("en-IN")}</span></div><p>{a.detail}</p></div>)}</div> : <p className="metric-card-note">No active monitoring alerts.</p>}<div className="button-row"><Link href="/bank/alerts"><Button variant="outline">View all alerts</Button></Link></div></CardContent></Card>
    </TwoColumnGrid>
    <Tabs defaultValue="overview">
      <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="identity">Identity</TabsTrigger><TabsTrigger value="organization">Organization</TabsTrigger><TabsTrigger value="score">Health score</TabsTrigger><TabsTrigger value="pd">Default risk</TabsTrigger><TabsTrigger value="applications">Applications</TabsTrigger><TabsTrigger value="alerts">Alerts</TabsTrigger></TabsList>
      <TabsContent value="applications">
        {data.applications.length ? <Card><CardContent><ul className="insight-list">{data.applications.map((a) => <li key={a.id} className="insight-row"><div className="insight-row-text"><strong>{a.id} · {a.product}</strong><span>{formatInrCompact(a.amount)} · {a.assignedTo} · {new Date(a.updatedAt).toLocaleDateString("en-IN")}</span></div><Badge variant={a.stage === "Approved" ? "success" : a.stage === "Declined" ? "warning" : "outline"}>{a.stage}</Badge></li>)}</ul></CardContent></Card> : <Card><CardContent><p className="metric-card-note">No credit applications for this enterprise.</p></CardContent></Card>}
      </TabsContent>
      <TabsContent value="overview">
        <MetricGrid columns={4}>
          <MetricCard title="Monthly revenue" value={formatInrCompact(snap.monthlyRevenue)} status="neutral" />
          <MetricCard title="Monthly expenses" value={formatInrCompact(snap.monthlyExpenses)} status="neutral" />
          <MetricCard title="Net cash flow" value={formatInrCompact(snap.netCashFlow)} status={snap.netCashFlow >= 0 ? "positive" : "negative"} />
          <MetricCard title="Outstanding liabilities" value={formatInrCompact(snap.liabilities)} status="neutral" />
        </MetricGrid>
        <Card><CardHeader><div><CardTitle>Coverage</CardTitle><CardDescription>Period {formatPeriod(snap.periodStart, snap.periodEnd)}</CardDescription></div></CardHeader><CardContent><ul className="kv-list"><li><span>Connected sources</span><strong>{msme.connectedSources.join(", ")}</strong></li><li><span>Accounts</span><strong>{snap.accounts}</strong></li><li><span>Transactions</span><strong>{snap.transactions}</strong></li><li><span>Onboarded</span><strong>{new Date(msme.onboardedAt).toLocaleDateString("en-IN")}</strong></li></ul></CardContent></Card>
      </TabsContent>
      <TabsContent value="identity">
        <Card><CardHeader><div><CardTitle>Identity and registrations</CardTitle><CardDescription>Masked identifiers — full values are never displayed.</CardDescription></div></CardHeader><CardContent><ul className="kv-list"><li><span>Legal name</span><strong>{msme.legalName}</strong></li><li><span>Trading name</span><strong>{msme.tradingName}</strong></li><li><span>PAN</span><strong>{msme.maskedPan}</strong></li><li><span>GSTIN</span><strong>{msme.gstin}</strong></li><li><span>Udyam</span><strong>{msme.udyam}</strong></li><li><span>Constitution</span><strong>{msme.constitution}</strong></li><li><span>NIC code</span><strong>{msme.nicCode}</strong></li></ul></CardContent></Card>
      </TabsContent>
      <TabsContent value="organization">
        {org ? <>
          <Card><CardHeader><div><CardTitle>Organization record</CardTitle><CardDescription>Canonical MSME organization under the bank tenant.</CardDescription></div><Badge variant={org.organization.verificationStatus === "VERIFIED" ? "success" : "warning"}>{org.organization.verificationStatus.replaceAll("_", " ")}</Badge></CardHeader><CardContent><ul className="kv-list"><li><span>PAN</span><strong>{org.organization.maskedPan}</strong></li><li><span>Onboarding source</span><strong>{org.organization.onboardingSource.replaceAll("_", " ")}</strong></li><li><span>Lifecycle status</span><strong>{org.organization.onboardingStatus.replaceAll("_", " ")}</strong></li><li><span>Customer category</span><strong>{org.organization.customerCategory.replaceAll("_", " ")}</strong></li>{org.organization.contactEmail ? <li><span>Owner contact</span><strong>{org.organization.contactEmail}</strong></li> : null}</ul></CardContent></Card>
          <TwoColumnGrid>
            <Card><CardHeader><div><CardTitle>Users and ownership</CardTitle><CardDescription>Organization memberships.</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{org.memberships.map((m) => <li key={m.id} className="insight-row"><div className="insight-row-text"><strong>{m.userEmail}</strong><span>{m.role.replaceAll("_", " ")}{m.ownershipPercentage ? ` · ${m.ownershipPercentage}% ownership` : ""}</span></div><Badge variant={m.authorizationStatus === "VERIFIED" ? "success" : "outline"}>{m.authorizationStatus}</Badge></li>)}</ul></CardContent></Card>
            <Card><CardHeader><div><CardTitle>Assignment history</CardTitle><CardDescription>Branch and RM changes retain history.</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{org.assignments.map((a) => <li key={a.id} className="insight-row"><div className="insight-row-text"><strong>{a.branchId} · {a.relationshipManagerId}</strong><span>Since {new Date(a.assignedAt).toLocaleDateString("en-IN")}{a.endedAt ? ` — ended ${new Date(a.endedAt).toLocaleDateString("en-IN")}` : ""}</span></div>{a.current ? <Badge variant="success">Current</Badge> : <Badge variant="outline">Past</Badge>}</li>)}</ul></CardContent></Card>
          </TwoColumnGrid>
          <Card><CardHeader><div><CardTitle>Lifecycle history</CardTitle><CardDescription>Status transitions with actor.</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{org.statusHistory.map((e) => <li key={e.id} className="insight-row"><div className="insight-row-text"><strong>{e.from ? `${e.from.replaceAll("_", " ")} → ` : ""}{e.to.replaceAll("_", " ")}</strong><span>{e.actor}{e.note ? ` · ${e.note}` : ""}</span></div><span className="insight-row-value">{new Date(e.at).toLocaleDateString("en-IN")}</span></li>)}</ul></CardContent></Card>
        </> : <Card><CardContent><p className="metric-card-note">No organization record is linked to this registry entry.</p></CardContent></Card>}
      </TabsContent>
      <TabsContent value="score">
        <MetricGrid columns={3}>{health.metrics.map((m) => <MetricCard key={m.id} title={m.name} value={m.formattedValue} status={cardStatus(m.status)} description={m.explanation} />)}</MetricGrid>
        <TwoColumnGrid>
          <Card><CardHeader><div><CardTitle>Top positive factors</CardTitle></div></CardHeader><CardContent><ul className="insight-list">{health.strengths.length ? health.strengths.map((s) => <li key={s.id} className="insight-row"><div className="insight-row-text"><strong>{s.title}</strong><span>{s.detail}</span></div></li>) : <li className="insight-row"><div className="insight-row-text"><span>None flagged.</span></div></li>}</ul></CardContent></Card>
          <Card><CardHeader><div><CardTitle>Top negative factors</CardTitle></div></CardHeader><CardContent><ul className="insight-list">{health.risks.length ? health.risks.map((r) => <li key={r.id} className="insight-row"><div className="insight-row-text"><strong>{r.title}</strong><span>{r.detail}</span></div></li>) : <li className="insight-row"><div className="insight-row-text"><span>None flagged.</span></div></li>}</ul></CardContent></Card>
        </TwoColumnGrid>
      </TabsContent>
      <TabsContent value="pd">
        <Card><CardHeader><div><CardTitle>Predicted 12-month probability of default: {(defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}%</CardTitle><CardDescription>Answers a different question from the health score: the likelihood of a defined default event within 12 months.</CardDescription></div><Badge variant={defaultRisk.probabilityOfDefault12M < 0.06 ? "success" : "warning"}>{defaultRisk.pdBand.replaceAll("_", " ")}</Badge></CardHeader><CardContent>
          <ul className="kv-list"><li><span>Model version</span><strong>{defaultRisk.modelVersion}</strong></li><li><span>Default definition</span><strong>{defaultRisk.definitionVersion}</strong></li><li><span>Segment</span><strong>{defaultRisk.segment.replaceAll("_", " ")}</strong></li><li><span>Status</span><strong>{defaultRisk.status}</strong></li></ul>
          <p className="metric-card-note">Bootstrap scorecard (Stage 1) — deterministic and monotonic, used to initialise the platform before a trained, outcome-calibrated model. Not a bureau score.</p>
          <ul className="insight-list">{defaultRisk.factors.map((f) => <li key={f.code} className="insight-row"><div className="insight-row-text"><strong>{f.code.replaceAll("_", " ")}</strong><span>{f.detail}</span></div><span className={`insight-row-value ${f.points > 0 ? "trend-negative" : "trend-positive"}`}>{f.points > 0 ? "+" : ""}{f.points} pts</span></li>)}</ul>
        </CardContent></Card>
      </TabsContent>
      <TabsContent value="alerts">
        {alerts.length ? <Card><CardContent><ul className="insight-list">{alerts.map((a) => <li key={a.id} className="insight-row"><div className="insight-row-text"><strong>{a.type.replaceAll("_", " ")}</strong><span>{a.detail}</span></div><Badge variant={a.severity === "Critical" || a.severity === "High" ? "warning" : "outline"}>{a.severity}</Badge></li>)}</ul></CardContent></Card> : <Card><CardContent><p className="metric-card-note">No active monitoring alerts for this enterprise.</p></CardContent></Card>}
      </TabsContent>
    </Tabs>
  </div>;
}
