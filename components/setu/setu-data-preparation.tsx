"use client";
import { useState } from "react";
type Result = { status: string; connectedAccounts: number; dataCompleteness: number; sufficient: boolean };
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
export default function SetuDataPreparation({ consentId }: { consentId: string }) {
  const [state, setState] = useState<"idle" | "preparing" | "ready" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  async function prepare() {
    setState("preparing"); setError(""); setResult(null);
    try {
      const sessionResponse = await fetch("/api/integrations/setu/sessions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ consentId }) });
      const sessionBody = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(sessionBody.title || "Could not start data preparation.");
      const sessionId: string = sessionBody.data.id;
      // Pull the authoritative session status from Setu with backoff; it moves PENDING -> PARTIAL/COMPLETED as FIPs respond.
      for (let attempt = 0; attempt < 8; attempt += 1) {
        await wait(Math.min(8000, 800 * 2 ** attempt));
        const fetchResponse = await fetch(`/api/integrations/setu/sessions/${sessionId}/fetch`, { method: "POST" });
        const fetchBody = await fetchResponse.json();
        if (!fetchResponse.ok) throw new Error(fetchBody.title || "Financial-data fetch failed.");
        if (["COMPLETED", "PARTIAL"].includes(fetchBody.data.status)) { setResult(fetchBody.data as Result); setState("ready"); return; }
      }
      throw new Error("Financial data is taking longer than expected at your bank. Please check again shortly.");
    } catch (value) { setError(value instanceof Error ? value.message : "Data preparation failed."); setState("error"); }
  }
  return <div className="recommendation">
    <span>Financial data</span>
    <strong>{result ? `${result.connectedAccounts} account${result.connectedAccounts === 1 ? "" : "s"} · ${result.dataCompleteness}% complete` : state === "preparing" ? "Preparing…" : "Not prepared"}</strong>
    <p>Fetch consented bank-account summaries and transactions so cash-flow, financial-health, and default-risk signals can be calculated.</p>
    {error && <p className="address-missing">{error}</p>}
    {result && !result.sufficient && <p className="address-missing">Not enough history yet for scoring (need ≥90 days, ≥20 transactions across ≥2 months).</p>}
    <div className="button-row">
      <button className="ui-button" disabled={state === "preparing"} onClick={prepare}>{state === "preparing" ? <><span className="spinner" aria-label="Preparing" /> Preparing…</> : result ? "Refresh financial data" : "Prepare financial data"}</button>
    </div>
  </div>;
}
