import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/foundation/page-header";
// Track 04 is out of scope for this task. The route still lives inside the app shell and renders a polished,
// honest placeholder — no fabricated prediction is shown.
export default function DefaultRiskPage() {
  return <div className="app-overview">
    <PageHeader eyebrow="Track 04" title="Default risk" description="A 12-month, explainable default-risk estimate. This module is not yet active." action={<Badge variant="warning">Upcoming module</Badge>} />
    <Alert><AlertTitle>No risk prediction has been generated</AlertTitle><AlertDescription>The 12-month default-risk prediction is the next module. It will use the Track 03 financial-health analysis as model input. No score, probability, sanction, or rejection is produced on this screen.</AlertDescription></Alert>
    <section className="two-grid">
      <Card><CardHeader><CardTitle>What this module will do</CardTitle></CardHeader><CardContent><ul className="bullet-list"><li><strong>Explainable estimate</strong><span>A 12-month probability-of-default band with contributing factors.</span></li><li><strong>Built on Track 03</strong><span>Uses the same normalized financial snapshot and health metrics as inputs.</span></li><li><strong>Assisted review</strong><span>Designed for analyst review, not autonomous approval or decline.</span></li></ul></CardContent></Card>
      <Card><CardHeader><CardTitle>Available now</CardTitle></CardHeader><CardContent><p className="muted-note">The Track 03 financial-health analysis that feeds this module is live today.</p><div className="button-row"><Link href="/app/financial-health"><Button>Open financial health</Button></Link></div></CardContent></Card>
    </section>
  </div>;
}
