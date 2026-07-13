"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
// Provider-unavailable state (used only when fallback is disabled and Setu fails). Plain-language, retry + safe nav,
// error reference code, no stack trace.
export function ProviderUnavailableState({ code }: { code?: string }) {
  const router = useRouter();
  return <div className="app-overview"><Alert><AlertTitle>Financial data is temporarily unavailable</AlertTitle><AlertDescription>We could not retrieve your connected financial data. Your account and existing records remain safe. Retry the connection or return to the overview.{code ? <span className="muted-note"> Reference: {code}</span> : null}</AlertDescription><div className="notice-actions"><Button variant="outline" onClick={() => router.refresh()}>Retry</Button><Link href="/app"><Button variant="outline">Back to overview</Button></Link><Link href="/app/settings"><Button variant="outline">Connection settings</Button></Link></div></Alert></div>;
}
