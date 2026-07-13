import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoColumnGrid } from "@/components/page/page-section";
import { listApplications } from "@/lib/msme-registry/applications";
import { getMsmeDetail } from "@/lib/msme-registry/registry";
import { evaluateApplication } from "@/lib/credit-decisioning/decision-engine";
import { store as notesStore } from "@/lib/analyst-workbench/notes-and-collaboration";
import { store as tasksStore } from "@/lib/analyst-workbench/task-assignment";
import { formatInrCompact, formatPeriod } from "@/lib/financial-data/format";
import { cardStatus } from "@/lib/financial-data/presentation";
// Analyst application workspace (08-003..08-009): borrower summary, evidence register, health panel, PD panel,
// notes, tasks, and the memo/decision links — every metric traceable to its source; masked identifiers only.
export default async function AnalystApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = listApplications().find((a) => a.id === id);
  if (!application) notFound();
  const detail = getMsmeDetail(application.msmeId);
  if (!detail) notFound();
  const { msme, snapshot, health, defaultRisk } = detail;
  const evaluation = evaluateApplication(detail, application);
  const notes = notesStore.list().records;
  const tasks = tasksStore.list().records;
  return <div className="app-overview">
    <header className="page-header"><div><p className="breadcrumb"><Link href="/app/analyst">Analyst workbench</Link> › <span>{application.id}</span></p><h1>{application.msmeName}</h1><div className="identity-strip"><span>PAN<strong>{msme.maskedPan}</strong></span><span>GSTIN<strong>{msme.gstin}</strong></span><span>Segment<strong>{msme.segment.replaceAll("_", " ")}</strong></span><span>Requested<strong>{formatInrCompact(application.amount)} · {application.product}</strong></span><span>Stage<strong>{application.stage}</strong></span></div></div><div className="button-row"><Link href={`/app/applications/${application.id}/decision`}><Button>Decision workspace</Button></Link><Link href={`/bank/msmes/${msme.id}`}><Button variant="outline">360 profile</Button></Link></div></header>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Health card panel</CardTitle><CardDescription>Same engine output as the customer card.</CardDescription></div><Badge variant={health.overallScore >= 65 ? "success" : "warning"}>{health.overallScore}/100 · {msme.healthBand}</Badge></CardHeader><CardContent><ul className="insight-list">{health.metrics.map((m) => <li key={m.id} className="insight-row"><div className="insight-row-text"><strong>{m.name}</strong><span>{m.explanation}</span></div><span className={`insight-row-value ${cardStatus(m.status) === "positive" ? "trend-positive" : cardStatus(m.status) === "negative" ? "trend-negative" : ""}`}>{m.formattedValue}</span></li>)}</ul></CardContent></Card>
      <Card><CardHeader><div><CardTitle>PD risk panel</CardTitle><CardDescription>{defaultRisk.modelVersion} · {defaultRisk.definitionVersion}</CardDescription></div><Badge variant={defaultRisk.probabilityOfDefault12M < 0.06 ? "success" : "warning"}>{(defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}% · {defaultRisk.pdBand.replaceAll("_", " ")}</Badge></CardHeader><CardContent>{defaultRisk.status === "PROVISIONAL" ? <p className="metric-card-note">Provisional — limited history.</p> : null}<ul className="insight-list">{defaultRisk.factors.map((f) => <li key={f.code} className="insight-row"><div className="insight-row-text"><strong>{f.code.replaceAll("_", " ")}</strong><span>{f.detail}</span></div><span className={`insight-row-value ${f.points > 0 ? "trend-negative" : "trend-positive"}`}>{f.points > 0 ? "+" : ""}{f.points}</span></li>)}</ul></CardContent></Card>
    </TwoColumnGrid>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Evidence register</CardTitle><CardDescription>Every metric traces to its source (evidence-v1).</CardDescription></div></CardHeader><CardContent><ul className="kv-list"><li><span>Sources connected</span><strong>{msme.connectedSources.join(", ")}</strong></li><li><span>Observation period</span><strong>{formatPeriod(snapshot.periodStart, snapshot.periodEnd)}</strong></li><li><span>Accounts / transactions</span><strong>{snapshot.accounts.length} / {snapshot.transactions.length}</strong></li><li><span>Data completeness</span><strong>{health.dataCompleteness}%</strong></li><li><span>Recommendation</span><strong>{evaluation.recommendation.replaceAll("_", " ")} ({evaluation.versions.policy})</strong></li></ul><p className="metric-card-note">Documents render as metadata only; raw payloads and identifiers stay masked.</p></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Notes and tasks</CardTitle><CardDescription>Immutable notes; tasks with due status.</CardDescription></div></CardHeader><CardContent><ul className="insight-list">{[...notes, ...tasks].map((r) => <li key={r.id} className="insight-row"><div className="insight-row-text"><strong>{r.label}</strong><span>{r.summary}</span></div><Badge variant={r.status === "Adopted" ? "success" : "outline"}>{r.status === "Adopted" ? "Recorded" : r.status}</Badge></li>)}</ul></CardContent></Card>
    </TwoColumnGrid>
    <div className="info-banner"><strong>Demonstration data.</strong> Approval memo assembly (memo-builder-v1) and export packs (export-pack-v1) generate from these live panels; recommendations are never autonomous approvals.</div>
  </div>;
}
