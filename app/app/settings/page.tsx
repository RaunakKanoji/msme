import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoColumnGrid } from "@/components/page/page-section";
import { getProviderHealthStatus } from "@/lib/financial-data/financial-data-service";
// Settings: one card per clearly-separated settings group (never one per field). The financial-connections card
// reports the real provider state from the server — no tokens, secrets, or raw errors.
export default async function SettingsPage() {
  const provider = await getProviderHealthStatus();
  const connectionState = provider.providerMode === "mock" ? "Running with demo data" : provider.configured ? (provider.reachable ? "Connected" : "Temporarily unavailable") : "Not configured";
  return <div className="app-overview">
    <header className="page-header"><div><h1>Settings</h1><p>Business, connection, and privacy preferences for this workspace.</p></div></header>
    <TwoColumnGrid>
      <Card><CardHeader><div><CardTitle>Business profile</CardTitle><CardDescription>Legal identity, registrations, and addresses.</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Business identity and KYB evidence are managed through onboarding.</p></CardContent><CardFooter><Link href="/app/onboarding"><Button variant="outline">Open onboarding</Button></Link></CardFooter></Card>
      <Card><CardHeader><div><CardTitle>Financial data connections</CardTitle><CardDescription>Setu Account Aggregator and fallback behaviour.</CardDescription></div><Badge variant={connectionState === "Connected" ? "success" : "warning"}>{connectionState}</Badge></CardHeader><CardContent><ul className="kv-list"><li><span>Provider mode</span><strong>{provider.providerMode}</strong></li><li><span>Fallback</span><strong>{provider.fallbackEnabled ? "Enabled" : "Disabled"}</strong></li><li><span>Active fallback</span><strong>{provider.activeFallback ?? "None"}</strong></li></ul>{provider.message ? <p className="metric-card-note">{provider.message}</p> : null}</CardContent><CardFooter><Link href="/app/data-connections"><Button variant="outline">Manage connections</Button></Link></CardFooter></Card>
      <Card><CardHeader><div><CardTitle>Privacy and consent</CardTitle><CardDescription>Purpose-limited data access and revocation.</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Review, refresh, or revoke Account Aggregator consent. Revocation stops future synchronisation.</p></CardContent><CardFooter><Link href="/app/settings/consents"><Button variant="outline">Manage consent</Button></Link></CardFooter></Card>
      <Card><CardHeader><div><CardTitle>Notifications</CardTitle><CardDescription>Alerts for scores, syncs, and reviews.</CardDescription></div><Badge variant="outline">Not configured</Badge></CardHeader><CardContent><p className="metric-card-note">Notification preferences are not yet available in this prototype.</p></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Account security</CardTitle><CardDescription>Sign-in and session preferences.</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Authentication is managed by Clerk. Use the account menu in the header to manage sessions and sign-in methods.</p></CardContent></Card>
      <Card><CardHeader><div><CardTitle>Data management</CardTitle><CardDescription>Retention and deletion.</CardDescription></div></CardHeader><CardContent><p className="metric-card-note">Privacy deletion must revoke access, stop periodic sync, and remove or anonymise financial records per policy, retaining only legally required audit evidence.</p></CardContent></Card>
    </TwoColumnGrid>
  </div>;
}
