"use client";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Bank-created MSME onboarding (spec §4.1): enter basics → duplicate check → PROVISIONAL organization → invite the
// owner. Exact identifier duplicates are refused with the matching organization shown, never silently created.
type Created = { id: string; legalName: string; onboardingStatus: string; verificationStatus: string };
type DuplicateInfo = { outcome: string; matches: Array<{ organizationId: string; legalName: string; matchedOn: string[] }> };
const headers = { "x-user-role": "bank_analyst", "content-type": "application/json" };
const BRANCHES = ["Mumbai Fort", "Ahmedabad CG Road", "Chennai Anna Salai", "Bengaluru MG Road", "Lucknow Hazratganj", "Kolkata Park Street", "Jaipur MI Road", "Hyderabad Banjara Hills"];
const RMS = ["A. Sharma", "P. Iyer", "R. Deshmukh", "S. Banerjee", "K. Reddy", "M. Patel", "V. Nair", "J. Singh"];
const CONSTITUTIONS = ["PROPRIETORSHIP", "PARTNERSHIP", "LLP", "PRIVATE_LIMITED", "OPC", "HUF"];
const INDUSTRIES = ["Manufacturing", "Trading", "Services", "Food processing", "Textiles", "Auto components", "Logistics", "Healthcare services"];
// Wizard steps (reference onboarding screen). Step 1 is implemented; 2–5 are honestly marked as pending modules.
const WIZARD_STEPS = ["Business Information", "Promoters", "KYC/Registration", "Data Consent", "Review"];
export default function AddMsmeWorkspace() {
  const [form, setForm] = useState({ legalName: "", tradingName: "", pan: "", gstin: "", udyam: "", constitutionType: "PROPRIETORSHIP", industryCode: INDUSTRIES[0], contactEmail: "", contactMobile: "", branchId: BRANCHES[0], relationshipManagerId: RMS[0] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);
  const [created, setCreated] = useState<Created | null>(null);
  const [invited, setInvited] = useState(false);
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [key]: event.target.value }));
  async function submit() {
    setBusy(true); setError(""); setDuplicate(null);
    try {
      const response = await fetch("/api/v1/bank/msme-organizations", { method: "POST", headers: { ...headers, "x-idempotency-key": `${form.pan}-${form.legalName}` }, body: JSON.stringify(form) });
      const body = await response.json();
      if (response.status === 409) { setDuplicate(body.duplicate); return; }
      if (!response.ok) throw new Error(body.error?.message);
      setCreated(body.data.organization);
      if (body.data.duplicate.outcome === "POSSIBLE_MATCH") setDuplicate(body.data.duplicate);
    } catch (err) { setError(err instanceof Error ? err.message : "The organization could not be created."); } finally { setBusy(false); }
  }
  async function invite() {
    if (!created || !form.contactEmail) return;
    setBusy(true);
    try { const response = await fetch(`/api/v1/bank/msme-organizations/${created.id}/invite`, { method: "POST", headers, body: JSON.stringify({ contact: form.contactEmail }) }); if (!response.ok) throw new Error((await response.json()).error?.message); setInvited(true); }
    catch (err) { setError(err instanceof Error ? err.message : "The invitation could not be sent."); } finally { setBusy(false); }
  }
  return <div className="app-overview">
    <header className="page-header"><div><h1>Onboarding — Business information</h1><p>Create a provisional organization, run duplicate checks, and invite the owner to complete verification and consent.</p></div><Link href="/bank/msmes"><Button variant="outline">Back to registry</Button></Link></header>
    <ol className="wizard-steps" aria-label="Onboarding steps">{WIZARD_STEPS.map((step, i) => <li key={step} className={i === 0 ? "active" : "pending"} aria-current={i === 0 ? "step" : undefined}><span className="wizard-step-dot">{i + 1}</span><span>{step}{i > 0 ? <em>Pending module</em> : null}</span></li>)}</ol>
    {error ? <Alert><AlertTitle>Could not complete the request</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}
    {duplicate && !created ? <Alert><AlertTitle>Duplicate organization detected</AlertTitle><AlertDescription>An organization with the same identifier already exists — link to it instead of creating a duplicate.<ul className="bullet-list">{duplicate.matches.map((m) => <li key={m.organizationId}><strong>{m.legalName}</strong><span>Matched on {m.matchedOn.join(", ")} · {m.organizationId}</span></li>)}</ul></AlertDescription></Alert> : null}
    {created ? <Card><CardHeader><div><CardTitle>{created.legalName}</CardTitle><CardDescription>{created.id}</CardDescription></div><Badge variant="warning">{created.verificationStatus}</Badge></CardHeader><CardContent><p className="metric-card-note">Organization created with status {created.onboardingStatus.replaceAll("_", " ").toLowerCase()}. {duplicate?.outcome === "POSSIBLE_MATCH" ? "A possible name match was flagged for identity review." : ""} {invited ? "Invitation sent — the owner can now complete verification and consent." : "Send the owner an invitation to complete onboarding."}</p></CardContent><CardFooter className="data-source-footer">{!invited ? <Button onClick={invite} disabled={busy || !form.contactEmail}>{busy ? "Sending…" : `Invite ${form.contactEmail || "owner"}`}</Button> : <Badge variant="success">Invited</Badge>}<Link href="/bank/msmes"><Button variant="outline">Back to registry</Button></Link></CardFooter></Card> : <Card>
      <CardHeader><div><CardTitle>Enterprise details</CardTitle><CardDescription>Identifiers are checked against the central registry before anything is created.</CardDescription></div></CardHeader>
      <CardContent>
        <div className="registry-controls add-msme-form">
          <label>Legal business name<input className="ui-input" value={form.legalName} onChange={set("legalName")} placeholder="e.g. Narmada Precision Tools LLP" /></label>
          <label>Trading name (optional)<input className="ui-input" value={form.tradingName} onChange={set("tradingName")} /></label>
          <label>PAN<input className="ui-input" value={form.pan} onChange={set("pan")} maxLength={10} placeholder="10 characters" /></label>
          <label>GSTIN (optional)<input className="ui-input" value={form.gstin} onChange={set("gstin")} /></label>
          <label>Udyam (optional)<input className="ui-input" value={form.udyam} onChange={set("udyam")} /></label>
          <label>Constitution type<select value={form.constitutionType} onChange={set("constitutionType")}>{CONSTITUTIONS.map((c) => <option key={c} value={c}>{c.replaceAll("_", " ")}</option>)}</select></label>
          <label>Industry<select value={form.industryCode} onChange={set("industryCode")}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></label>
          <label>Owner email<input className="ui-input" type="email" value={form.contactEmail} onChange={set("contactEmail")} /></label>
          <label>Owner mobile<input className="ui-input" inputMode="numeric" maxLength={10} value={form.contactMobile} onChange={set("contactMobile")} /></label>
          <label>Home branch<select value={form.branchId} onChange={set("branchId")}>{BRANCHES.map((b) => <option key={b}>{b}</option>)}</select></label>
          <label>Relationship manager<select value={form.relationshipManagerId} onChange={set("relationshipManagerId")}>{RMS.map((r) => <option key={r}>{r}</option>)}</select></label>
        </div>
      </CardContent>
      <CardFooter className="data-source-footer"><Link href="/bank/msmes"><Button variant="outline">Cancel</Button></Link><Button onClick={submit} disabled={busy || !form.legalName.trim() || form.pan.trim().length < 10}>{busy ? "Checking…" : "Save & next"}</Button></CardFooter>
    </Card>}
  </div>;
}
