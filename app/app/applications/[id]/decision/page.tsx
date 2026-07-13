import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoColumnGrid } from "@/components/page/page-section";
import { listApplications } from "@/lib/msme-registry/applications";
import { getMsmeDetail } from "@/lib/msme-registry/registry";
import { evaluateApplication } from "@/lib/credit-decisioning/decision-engine";
import { formatInrCompact } from "@/lib/financial-data/format";
// Shared 07-batch surface: the decision workspace for one application — versioned policy results, matrix
// recommendation, affordability-based limit, expected-loss rate, and the human-authority/override rules. All
// figures come from the shared engines; demonstration data; never an autonomous approval.
const REC_LABEL: Record<string, string> = { ELIGIBLE: "Eligible", CONDITIONALLY_ELIGIBLE: "Conditionally eligible", MANUAL_REVIEW: "Manual review", DECLINE_RECOMMENDED: "Decline recommended" };
export default async function ApplicationDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = listApplications().find((a) => a.id === id);
  if (!application) notFound();
  const detail = getMsmeDetail(application.msmeId);
  if (!detail) notFound();
  const evaluation = evaluateApplication(detail, application);
  return <div className="app-overview">
    <header className="page-header"><div><h1>Credit decision workspace</h1><p>{application.id} · {application.msmeName} · {application.product} for {formatInrCompact(application.amount)}. Demonstration data — not a credit decision.</p></div><Link href={`/app/businesses/${application.msmeId}/risk`}><Button variant="outline">Open risk view</Button></Link></header>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Recommendation</CardTitle><CardDescription>{evaluation.versions.matrix} · policy {evaluation.versions.policy}</CardDescription></div><Badge variant={evaluation.recommendation === "ELIGIBLE" ? "success" : "warning"}>{REC_LABEL[evaluation.recommendation]}</Badge></CardHeader><CardContent>
        <ul className="kv-list">
          <li><span>Health score</span><strong>{detail.health.overallScore}/100</strong></li>
          <li><span>12-month PD</span><strong>{(detail.defaultRisk.probabilityOfDefault12M * 100).toFixed(1)}% ({detail.defaultRisk.pdBand.replaceAll("_", " ")})</strong></li>
          <li><span>Recommended limit</span><strong>{formatInrCompact(evaluation.recommendedLimit)} (requested {formatInrCompact(application.amount)})</strong></li>
          <li><span>Max annual debt service</span><strong>{formatInrCompact(evaluation.maxAnnualDebtService)} at {evaluation.targetDscr}x target DSCR</strong></li>
          <li><span>Expected-loss rate</span><strong>{(evaluation.expectedLossRate * 100).toFixed(2)}% (PD × LGD 45%)</strong></li>
          <li><span>Model / bands</span><strong>{evaluation.versions.model} · {evaluation.versions.bands}</strong></li>
        </ul>
        <p className="metric-card-note">{evaluation.humanAuthorityNote}</p>
      </CardContent></Card>
      <Card><CardHeader><div><CardTitle>Policy rule results</CardTitle><CardDescription>Versioned eligibility rules evaluated against live assessments.</CardDescription></div></CardHeader><CardContent>
        <ul className="insight-list">{evaluation.policyResults.map((r) => <li key={r.rule} className="insight-row"><div className="insight-row-text"><strong>{r.rule.replaceAll("_", " ")}</strong><span>{r.detail}</span></div><Badge variant={r.outcome === "PASS" ? "success" : r.outcome === "FAIL" ? "warning" : "outline"}>{r.outcome}</Badge></li>)}</ul>
      </CardContent></Card>
    </TwoColumnGrid>
    <div className="info-banner"><strong>Overrides are never silent.</strong> Changing this recommendation requires a recorded justification, supporting document, user authority, prior and new decision, and maker-checker approval — all appended to the immutable decision audit ledger (decision-ledger-v1).</div>
  </div>;
}
