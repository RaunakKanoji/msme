"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge, type DataSourceInfo } from "@/components/financial-data/data-source-badge";
// Level 1 companion card: the state of the financial-data connection. Shows mode, provider, freshness, and a retry
// action. Never shows raw API failures or secrets.
const STATUS_LINE: Record<string, string> = {
  live: "Connected — live bank data is flowing.",
  cached: "Showing the latest saved snapshot while the live connection is unavailable.",
  demo: "Demo data active — the live banking connection is temporarily unavailable.",
  manual: "Manually entered data is in use.",
};
export function DataSourceCard({ source, provider = "Setu Account Aggregator", accountCount, reportingPeriod }: { source: DataSourceInfo; provider?: string; accountCount?: number; reportingPeriod?: string }) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  function retry() { setRetrying(true); router.refresh(); setTimeout(() => setRetrying(false), 1200); }
  return <Card className="data-source-card">
    <CardHeader><div><CardTitle>Financial data connection</CardTitle><CardDescription>{provider}</CardDescription></div><DataSourceBadge source={source} /></CardHeader>
    <CardContent>
      <p className="data-source-line">{STATUS_LINE[source.status] ?? STATUS_LINE.demo}</p>
      <ul className="kv-list">
        {typeof accountCount === "number" ? <li><span>Accounts</span><strong>{accountCount}</strong></li> : null}
        {reportingPeriod ? <li><span>Reporting period</span><strong>{reportingPeriod}</strong></li> : null}
        <li><span>Data mode</span><strong>{source.status === "live" ? "Live" : source.status === "cached" ? "Cached snapshot" : source.status === "manual" ? "Manual" : "Demonstration"}</strong></li>
      </ul>
    </CardContent>
    <CardFooter className="data-source-footer">
      {source.status !== "live" ? <Button variant="outline" onClick={retry} disabled={retrying}>{retrying ? "Retrying…" : "Retry connection"}</Button> : null}
      <Link href="/app/data-connections"><Button variant="outline">Connection settings</Button></Link>
    </CardFooter>
  </Card>;
}
