"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { DataSourceInfo } from "./data-source-badge";
// Non-disruptive notice shown when data is demo or cached (never a destructive red alert for a working fallback).
export function FallbackNotice({ source }: { source: DataSourceInfo }) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);
  if (source.status === "live" || dismissed) return null;
  const demo = source.status === "demo";
  const title = demo ? "Demo financial data is active" : "Showing your latest saved snapshot";
  const body = source.message ?? (demo
    ? "The live banking connection is temporarily unavailable, so the financial-health dashboard is using a temporary demonstration dataset. Figures below are illustrative, not real bank data."
    : "Live financial data is temporarily unavailable. These figures come from the most recent successful synchronisation.");
  async function retry() { setRetrying(true); router.refresh(); setTimeout(() => setRetrying(false), 1200); }
  return <Alert><AlertTitle>{title}</AlertTitle><AlertDescription>{body}</AlertDescription><div className="notice-actions"><Button variant="outline" onClick={retry} disabled={retrying}>{retrying ? "Retrying…" : "Retry connection"}</Button><Link href="/app/settings"><Button variant="outline">Connection settings</Button></Link><Button variant="outline" onClick={() => setDismissed(true)}>Dismiss</Button></div></Alert>;
}
