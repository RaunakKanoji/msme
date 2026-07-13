"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoColumnGrid } from "@/components/page/page-section";
import SetuDataPreparation from "./setu-data-preparation";
// Data connections — consolidated layout (page-header + cards + kv-list) so spacing matches the rest of the app:
// compact header with the status as a badge, one alert, and two evenly padded cards with tight label/value rows.
type Status = { mode: string; environment: string; status: string; consent: null | { id: string; expiresAt: string; from: string; to: string; completeness: number }; productionReady: boolean };
export default function DataConnectionsDashboard() {
  const [data, setData] = useState<Status | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void fetch("/api/integrations/setu/status").then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.title); setData(body.data); }).catch((value) => setError(value instanceof Error ? value.message : "Connection status is unavailable.")); }, []);
  if (error) return <main className="state-panel error-state"><strong>Financial connection unavailable</strong><span>{error}</span></main>;
  if (!data) return <main className="state-panel"><span className="spinner" aria-label="Loading" /><strong>Checking financial-data connection…</strong></main>;
  const connected = data.status === "ACTIVE";
  const statusLabel = data.status.replaceAll("_", " ").toLowerCase();
  return <div className="app-overview">
    <header className="page-header"><div><h1>Data connections</h1><p>Connect business bank accounts through consented Account Aggregator access. MSME Arogya360 cannot move money or see bank-login credentials.</p><div className="overview-header-meta"><span>{data.environment} environment</span><span>{data.mode} mode</span></div></div><Badge variant={connected ? "success" : "warning"}>{statusLabel}</Badge></header>
    {!data.productionReady && <Alert><AlertTitle>Sandbox readiness only</AlertTitle><AlertDescription>Production requires FIU onboarding, approved product-instance configuration, production credentials, callbacks, and live FIP testing.</AlertDescription></Alert>}
    <TwoColumnGrid>
      <Card>
        <CardHeader><div><CardTitle>Setu Account Aggregator</CardTitle><CardDescription>Business bank accounts · purpose-limited access</CardDescription></div><Badge variant={connected ? "success" : "warning"}>{statusLabel}</Badge></CardHeader>
        <CardContent>
          <div className="metric-card-value">{data.consent ? `${data.consent.completeness}% complete` : "Not connected"}</div>
          <p className="metric-card-note">Bank-account summaries and transactions support cash-flow stability, financial health, and an explainable 12-month default-risk estimate.</p>
          {connected && data.consent ? <SetuDataPreparation consentId={data.consent.id} /> : null}
        </CardContent>
        <CardFooter className="data-source-footer"><Link href="/app/data-connections/setu"><Button>{data.consent ? "Manage connection" : "Connect bank accounts"}</Button></Link><Link href="/app/settings/consents"><Button variant="outline">Manage consent</Button></Link></CardFooter>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Connection details</CardTitle><CardDescription>Data coverage for this consent</CardDescription></div></CardHeader>
        <CardContent>
          <ul className="kv-list">
            <li><span>Connected accounts</span><strong>{connected ? "Shown after data preparation" : "Not connected"}</strong></li>
            <li><span>Available period</span><strong>{data.consent ? `${new Date(data.consent.from).toLocaleDateString("en-IN")} – ${new Date(data.consent.to).toLocaleDateString("en-IN")}` : "Not available"}</strong></li>
            <li><span>Consent expiry</span><strong>{data.consent ? new Date(data.consent.expiresAt).toLocaleDateString("en-IN") : "Not available"}</strong></li>
            <li><span>Environment</span><strong>{data.environment} · {data.mode} mode</strong></li>
          </ul>
          {!connected ? <p className="metric-card-note">Coverage details appear once a consent is active and financial data has been prepared.</p> : null}
        </CardContent>
      </Card>
    </TwoColumnGrid>
  </div>;
}
