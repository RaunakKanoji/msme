"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function RefreshButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return <Button variant="outline" disabled={busy} onClick={() => { setBusy(true); router.refresh(); setTimeout(() => setBusy(false), 1000); }}>{busy ? "Refreshing…" : "Refresh data"}</Button>;
}
