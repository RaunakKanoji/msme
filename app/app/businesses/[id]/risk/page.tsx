import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoColumnGrid } from "@/components/page/page-section";
import { getMsmeDetail } from "@/lib/msme-registry/registry";
import { PD_BAND_CONFIG } from "@/lib/default-risk/risk-bands";
// Shared 06-batch surface: the 12-month default-risk view for one business — real PD assessment with scorecard
// attributions (06-008), confidence/provisional status (06-009), governing versions (06-001/002/006), and the
// synthetic-data disclaimer (06-012). Not a credit decision.
export default async function BusinessRiskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getMsmeDetail(id);
  if (!detail) notFound();
  const { msme, defaultRisk } = detail;
  return <div className="app-overview">
    <header className="page-header"><div><h1>12-month default risk</h1><p>{msme.legalName} — explainable analytical estimate. Demonstration data; not a credit decision.</p><div className="overview-header-meta"><span>Assessed {new Date(defaultRisk.generatedAt).toLocaleDateString("en-IN")}</span><span>{defaultRisk.segment.replaceAll("_", " ")}</span></div></div><Link href={`/app/businesses/${id}/health-card`}><Button variant="outline">Open health card</Button></Link></header>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Predicted 12-month probability of default</CardTitle><CardDescription>Separate from the health score — the likelihood of a defined default event within 12 months.</CardDescription></div><Badge variant={defaultRisk.probabilityOfDefault12M < 0.06 ? "success" : "warning"}>{defaultRisk.pdBand.replaceAll("_", " ")}</Badge></CardHeader><CardContent>
        <div className="pd-big">{(defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}%</div>
        {defaultRisk.status === "PROVISIONAL" ? <Badge variant="outline">Provisional — limited history</Badge> : null}
        <ul className="kv-list"><li><span>Model</span><strong>{defaultRisk.modelVersion}</strong></li><li><span>Default definition</span><strong>{defaultRisk.definitionVersion}</strong></li><li><span>Band configuration</span><strong>{PD_BAND_CONFIG.version}</strong></li><li><span>Feature set</span><strong>aa-risk-features-v1</strong></li></ul>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>What moved this estimate</CardTitle><CardDescription>Exact additive scorecard attributions (points → PD).</CardDescription></div></CardHeader><CardContent>
        <ul className="insight-list">{defaultRisk.factors.map((f) => <li key={f.code} className="insight-row"><div className="insight-row-text"><strong>{f.code.replaceAll("_", " ")}</strong><span>{f.detail}</span></div><span className={`insight-row-value ${f.points > 0 ? "trend-negative" : "trend-positive"}`}>{f.points > 0 ? "+" : ""}{f.points} pts</span></li>)}</ul>
      </CardContent></Card>
    </TwoColumnGrid>
    <div className="info-banner"><strong>Demonstration data.</strong> This risk estimate is generated from demonstration data for product evaluation. It is not a credit decision, offer, or bureau score. Missing bureau history is treated as neutral for new-to-credit enterprises.</div>
  </div>;
}
