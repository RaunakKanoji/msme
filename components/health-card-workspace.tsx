"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BorrowerHealthCardView, { type BorrowerView } from "./borrower-health-card-view";
import AnalystHealthCardView, { type AnalystView } from "./analyst-health-card-view";
// Shared surface for the 05-financial-health-card batch (/app/businesses/[id]/health-card). Composes the health
// score framework (05-001) aggregate with the borrower (05-011) and analyst (05-012) views behind a role toggle.
type Card = { business_name: string; masked_reference: string; band: "Healthy" | "Watch" | "Stress"; overall_score: number; framework_version: string };
const headers = { "x-user-role": "bank_analyst" };
export default function HealthCardWorkspace({ businessId }: { businessId: string }) {
  const [state, setState] = useState<"loading" | "ready" | "error" | "unauthorized">("loading");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const [mode, setMode] = useState<"borrower" | "analyst">("analyst");
  const [card, setCard] = useState<Card | null>(null);
  const [borrower, setBorrower] = useState<BorrowerView | null>(null);
  const [analyst, setAnalyst] = useState<AnalystView | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; void (async () => {
    try {
      const responses = await Promise.all([fetch("/api/v1/health-score-framework", { headers }), fetch("/api/v1/borrower-health-card-view", { headers }), fetch("/api/v1/analyst-health-card-view", { headers })]);
      if (!active) return;
      if (responses.some((response) => response.status === 403)) { setState("unauthorized"); return; }
      const [framework, borrowerBody, analystBody] = await Promise.all(responses.map((response) => response.json()));
      if (!responses[0].ok) throw new Error(framework.error?.message);
      setCard(framework.data.cards[0] ?? null); setBorrower(borrowerBody.data?.views?.[0] ?? null); setAnalyst(analystBody.data?.views?.[0] ?? null); setState("ready");
    } catch (error) { if (active) { setState("error"); setMessage(error instanceof Error ? error.message : "We couldn’t load the health card."); } }
  })(); return () => { active = false; }; }, [retry]);
  async function publish() { if (!analyst) return; setBusy(true); try { const response = await fetch(`/api/v1/analyst-health-card-view/${analyst.id}`, { method: "PATCH", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ status: "Published" }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error?.message); setAnalyst(result.data); } catch (error) { setMessage(error instanceof Error ? error.message : "We couldn’t publish the card."); } finally { setBusy(false); } }
  if (state === "loading") return <main className="state-panel"><span className="spinner" aria-label="Loading" /><strong>Loading financial health card…</strong></main>;
  if (state === "unauthorized") return <main className="state-panel error-state"><strong>Access unavailable</strong><span>You do not have permission to view this health card.</span></main>;
  if (state === "error" || !card) return <main className="state-panel error-state"><strong>Health card unavailable</strong><span>{message}</span><button onClick={() => { setState("loading"); setRetry((value) => value + 1); }}>Try again</button></main>;
  return <main className="workspace"><nav className="workspace-nav" aria-label="Financial health navigation"><Link href="/app/financial-health">Financial health</Link><Link className="active" href={`/app/businesses/${businessId}/health-card`}>Health card</Link><Link href="/app/default-risk">Default risk</Link></nav><section className="hero"><div><p className="eyebrow">MSME Arogya360 / financial health card</p><h1>Financial health card</h1><p>{card.business_name} · {card.masked_reference}. An explainable, multidimensional analytical view — not a credit decision.</p></div><div className="hero-status"><span className="live-dot" />{card.band}<small>{card.overall_score}/100 · {card.framework_version}</small></div></section><div className="button-row" role="tablist" aria-label="Health card audience"><button role="tab" aria-selected={mode === "borrower"} className={mode === "borrower" ? "ui-button" : "ui-button ui-button-outline"} onClick={() => setMode("borrower")}>Borrower view</button><button role="tab" aria-selected={mode === "analyst"} className={mode === "analyst" ? "ui-button" : "ui-button ui-button-outline"} onClick={() => setMode("analyst")}>Analyst view</button></div>{mode === "borrower" ? (borrower ? <BorrowerHealthCardView view={borrower} /> : <section className="empty-state"><strong>No borrower view available</strong><span>The borrower-facing card has not been prepared.</span></section>) : (analyst ? <AnalystHealthCardView view={analyst} onPublish={publish} busy={busy} /> : <section className="empty-state"><strong>No analyst view available</strong><span>The analyst card has not been prepared.</span></section>)}</main>;
}
