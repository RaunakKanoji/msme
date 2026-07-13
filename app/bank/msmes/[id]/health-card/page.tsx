import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoColumnGrid } from "@/components/page/page-section";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMsmeDetail } from "@/lib/msme-registry/registry";
import { METRIC_WEIGHTS } from "@/lib/financial-data/financial-health-engine";
// Financial Health Card (reference screen): gauge, score trend, PD panel, pillar breakdown with real engine
// weights and contributions, strengths and improvement areas. All values come from the shared engines; the trend
// history is deterministic demonstration data derived from the current score.
const TREND_OFFSETS = [-16, -13, -8, -6, 0];
const TREND_LABELS = ["Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"];
function gaugeColor(score: number) { return score >= 65 ? "#1e7f4f" : score >= 50 ? "#e2a63c" : "#c2402f"; }
export default async function BankHealthCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getMsmeDetail(id);
  if (!detail) notFound();
  const { msme, health, defaultRisk } = detail;
  const points = TREND_OFFSETS.map((offset) => Math.max(5, Math.min(100, health.overallScore + offset)));
  const svgPoints = points.map((score, i) => `${40 + i * 120},${130 - score * 1.1}`).join(" ");
  const pillars = health.metrics.map((m) => ({ ...m, weight: METRIC_WEIGHTS[m.id] ?? 0, contribution: (m.score * (METRIC_WEIGHTS[m.id] ?? 0)) / 10 }));
  const strengths = [...health.metrics].filter((m) => m.status === "good").sort((a, b) => b.score - a.score);
  const improve = [...health.metrics].filter((m) => m.status !== "good").sort((a, b) => a.score - b.score);
  return <div className="app-overview">
    <header className="page-header"><div><h1>Financial health card</h1><p>Comprehensive view of business financial health and risk metrics — {msme.legalName}. Demonstration data.</p><div className="overview-header-meta"><span>Assessment {new Date(msme.lastAssessedAt).toLocaleDateString("en-IN")}</span><span>{msme.segment.replaceAll("_", " ")}</span></div></div><Link href={`/bank/msmes/${msme.id}`}><Button variant="outline">Back to profile</Button></Link></header>
    <div className="health-card-top">
      <Card className="gauge-card"><CardHeader><div><CardTitle>Financial health score</CardTitle></div></CardHeader><CardContent>
        <div className="gauge" style={{ background: `conic-gradient(${gaugeColor(health.overallScore)} ${health.overallScore * 3.6}deg, var(--neutral-surface, #eef1f5) 0deg)` }} role="img" aria-label={`Score ${health.overallScore} of 100`}><div className="gauge-center"><strong>{health.overallScore}</strong><span>/100</span></div></div>
        <div className="gauge-meta"><Badge variant={health.overallScore >= 65 ? "success" : "warning"}>{msme.healthBand}</Badge><p className="metric-card-note">Updated {new Date(msme.lastAssessedAt).toLocaleDateString("en-IN")}</p></div>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>Score trend</CardTitle><CardDescription>Score (0–100) · deterministic demo history</CardDescription></div></CardHeader><CardContent>
        <svg viewBox="0 0 560 160" className="trend-svg" role="img" aria-label={`Score trend: ${points.join(", ")}`}>
          <polyline fill="none" stroke="#1e7f4f" strokeWidth="2.5" points={svgPoints} />
          {points.map((score, i) => <g key={i}><circle cx={40 + i * 120} cy={130 - score * 1.1} r="4" fill="#1e7f4f" /><text x={40 + i * 120} y={118 - score * 1.1} textAnchor="middle" fontSize="12" fill="#334155">{score}</text><text x={40 + i * 120} y="152" textAnchor="middle" fontSize="11" fill="#64748b">{TREND_LABELS[i]}</text></g>)}
        </svg>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>12-month probability of default</CardTitle></div></CardHeader><CardContent>
        <div className="pd-big">{(defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}%</div>
        <Badge variant={defaultRisk.probabilityOfDefault12M < 0.06 ? "success" : "warning"}>{defaultRisk.pdBand.replaceAll("_", " ")}</Badge>
        <p className="metric-card-note">Based on the current financial profile and business risk indicators. Separate from the health score; not a bureau score. {defaultRisk.modelVersion}</p>
      </CardContent></Card>
    </div>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Pillar breakdown</CardTitle><CardDescription>Weighted assessment (health-score-v1).</CardDescription></div></CardHeader><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Pillar</TableHead><TableHead>Score (0–100)</TableHead><TableHead>Weight</TableHead><TableHead>Contribution</TableHead></TableRow></TableHeader>
          <TableBody>
            {pillars.map((p) => <TableRow key={p.id}><TableCell><strong>{p.name}</strong></TableCell><TableCell><div className="pillar-score"><span>{p.score}/100</span><div className="stage-track"><div className="stage-fill" style={{ width: `${p.score}%`, background: gaugeColor(p.score) }} /></div></div></TableCell><TableCell>{Math.round(p.weight * 100)}%</TableCell><TableCell><strong>{p.contribution.toFixed(1)}</strong></TableCell></TableRow>)}
            <TableRow><TableCell><strong>Total</strong></TableCell><TableCell></TableCell><TableCell><strong>100%</strong></TableCell><TableCell><strong>{(pillars.reduce((s, p) => s + p.contribution, 0)).toFixed(1)}</strong></TableCell></TableRow>
          </TableBody>
        </Table>
      </CardContent></Card>
      <div className="app-overview" style={{ gap: "1rem", display: "grid" }}>
        <Card><CardHeader><div><CardTitle>Top strengths</CardTitle></div></CardHeader><CardContent><ul className="insight-list">{strengths.length ? strengths.map((m) => <li key={m.id} className="insight-row"><div className="insight-row-text"><strong>{m.name}</strong><span>{m.explanation}</span></div><span className="insight-row-value">{m.score}/100</span></li>) : <li className="insight-row"><div className="insight-row-text"><span>No pillar is in the good band this period.</span></div></li>}</ul></CardContent></Card>
        <Card><CardHeader><div><CardTitle>Key areas to improve</CardTitle></div></CardHeader><CardContent><ul className="insight-list">{improve.length ? improve.map((m) => <li key={m.id} className="insight-row"><div className="insight-row-text"><strong>{m.name}</strong><span>{m.explanation}</span></div><span className="insight-row-value trend-warning">{m.score}/100</span></li>) : <li className="insight-row"><div className="insight-row-text"><span>All pillars are currently in the good band.</span></div></li>}</ul></CardContent></Card>
      </div>
    </TwoColumnGrid>
    <div className="info-banner">Financial Health Score is calculated using a weighted assessment across {pillars.length} pillars. Score range is 0–100. Deterministic, explainable scoring — not a credit decision or bureau score.</div>
  </div>;
}
