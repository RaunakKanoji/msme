import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard } from "@/components/cards/metric-card";
import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { MetricGrid, PageSection } from "@/components/page/page-section";
import { listUploadedDocuments } from "@/lib/documents-upload";
// Documents: summary metric cards + ONE table for the collection (never a card per file), plus a clearly-labelled
// demo upload card. Data comes from the existing synthetic documents adapter — nothing hardcoded here.
export default function DocumentsPage() {
  const documents = listUploadedDocuments();
  const verified = documents.filter((d) => d.review_status === "Verified").length;
  const review = documents.filter((d) => d.review_status === "Needs review").length;
  const missing = documents.filter((d) => d.upload_status !== "Available").length;
  return <div className="app-overview">
    <header className="page-header"><div><h1>Documents</h1><p>Evidence documents supporting onboarding and financial review. Metadata only — file contents are never displayed.</p></div><Link href="/app/onboarding/documents"><Button variant="outline">Open intake workspace</Button></Link></header>
    <PageSection title="Summary">
      <MetricGrid columns={4}>
        <MetricCard title="Total documents" value={String(documents.length)} status="neutral" description="Registered in this workspace." />
        <MetricCard title="Verified" value={String(verified)} status="positive" description="Reviewed and accepted." />
        <MetricCard title="Awaiting review" value={String(review)} status={review ? "warning" : "neutral"} description="Pending analyst review." />
        <MetricCard title="Missing or rejected" value={String(missing)} status={missing ? "warning" : "positive"} description="Need re-upload or follow-up." />
      </MetricGrid>
    </PageSection>
    <PageSection title="Upload">
      <Card><CardHeader><div><CardTitle>Add a document</CardTitle><CardDescription>Bank statements, GST reports, financial statements, invoices, loan and registration documents.</CardDescription></div><Badge variant="outline">Demo workspace</Badge></CardHeader><CardContent><p className="metric-card-note">Uploads in this prototype record metadata through the intake workspace; no live file storage is connected. Documents are consent-linked and processed with redaction.</p><div className="button-row"><Link href="/app/onboarding/documents"><Button>Record a document</Button></Link></div></CardContent></Card>
    </PageSection>
    <PageSection title="All documents">
      {documents.length ? <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Upload</TableHead><TableHead>Review</TableHead><TableHead>Freshness</TableHead><TableHead>Completeness</TableHead></TableRow></TableHeader>
          <TableBody>{documents.map((d) => <TableRow key={d.id}><TableCell><strong>{d.file_label}</strong></TableCell><TableCell>{d.document_type}</TableCell><TableCell><Badge variant={d.upload_status === "Available" ? "success" : "warning"}>{d.upload_status}</Badge></TableCell><TableCell><Badge variant={d.review_status === "Verified" ? "success" : "warning"}>{d.review_status}</Badge></TableCell><TableCell>{d.freshness}</TableCell><TableCell>{d.completeness}%</TableCell></TableRow>)}</TableBody>
        </Table>
      </CardContent></Card> : <EmptyStateCard title="No documents yet" description="Documents strengthen your financial profile and speed up review. Record your first document from the intake workspace." actionLabel="Record a document" actionHref="/app/onboarding/documents" />}
    </PageSection>
  </div>;
}
