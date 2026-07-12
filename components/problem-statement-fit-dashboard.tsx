"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FitAssessment } from "@/lib/problem-statement-fit";

type ApiResult = { data: FitAssessment[]; trace_id: string };

export function ProblemStatementFitDashboard() {
  const [assessments, setAssessments] = useState<FitAssessment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<"All" | FitAssessment["status"]>("All");

  const load = async () => {
    setState("loading");
    try {
      const response = await fetch("/api/v1/problem-statement-fit", { headers: { "x-user-role": "bank_analyst" } });
      if (!response.ok) throw new Error("Unable to load the assessment queue.");
      const result: ApiResult = await response.json();
      setAssessments(result.data);
      setSelectedId((current) => current || result.data[0]?.id || "");
      setState("ready");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to load the assessment queue.");
      setState("error");
    }
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, []);
  const recordReview = async () => {
    if (!selectedId) return;
    setNotice("Recording review…");
    try {
      const response = await fetch(`/api/v1/problem-statement-fit/${selectedId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-user-role": "bank_analyst" },
        body: JSON.stringify({ status: selected?.status }),
      });
      if (!response.ok) throw new Error("The review could not be recorded.");
      const result: { data: FitAssessment; trace_id: string } = await response.json();
      setAssessments((current) => current.map((item) => item.id === result.data.id ? result.data : item));
      setNotice(`Review recorded in the immutable audit trail · ${result.trace_id}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The review could not be recorded.");
    }
  };
  const visible = assessments.filter((item) => filter === "All" || item.status === filter);
  const selected = assessments.find((item) => item.id === selectedId) || visible[0];

  if (state === "loading") return <main className="state-panel" aria-live="polite"><span className="spinner" /> Loading synthetic assessment data…</main>;
  if (state === "error") return <main className="state-panel error-state" role="alert"><strong>We couldn’t load this workspace.</strong><span>{notice}</span><button onClick={() => void load()}>Try again</button></main>;

  return <main className="workspace"><nav className="workspace-nav" aria-label="Product foundation"><Link className="active" href="/app/problem-statement-fit">Problem statement fit</Link><Link href="/app/track-03-04-scope">Track 03 &amp; 04 scope</Link><Link href="/app/target-personas">Target personas</Link></nav>
    <section className="hero" aria-labelledby="page-title">
      <div><p className="eyebrow">MSME Arogya360 / Assessment workspace</p><h1 id="page-title">Problem statement fit</h1><p>Turn alternate data into a clear, reviewable next step for every MSME.</p></div>
      <div className="hero-status"><span className="live-dot" /> Synthetic demo data <small>Sandbox-ready adapter</small></div>
    </section>
    <section className="metrics" aria-label="Assessment summary"><Metric label="Ready for review" value={`${assessments.filter((x) => x.status === "Ready").length}`} note="Evidence attached" /><Metric label="Average confidence" value={`${Math.round(assessments.reduce((sum, x) => sum + x.confidence, 0) / Math.max(assessments.length, 1))}%`} note="Explainable assessment" /><Metric label="Data attention" value={`${assessments.filter((x) => x.evidence.some((e) => e.freshness === "Stale")).length}`} note="Stale source flagged" /></section>
    <section className="content-grid">
      <div className="queue-card"><div className="section-heading"><div><p className="eyebrow">Review queue</p><h2>MSME assessments</h2></div><label className="filter-label">Status<select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}><option>All</option><option>Ready</option><option>Needs review</option></select></label></div>
        {visible.length ? <div className="assessment-list">{visible.map((item) => <button key={item.id} className={`assessment-row ${selected?.id === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}><span><strong>{item.organization_name}</strong><small>{item.title}</small></span><span className={`status ${item.status === "Ready" ? "ready" : "review"}`}>{item.status}</span><b>{item.confidence}%</b></button>)}</div> : <div className="empty-state"><strong>No matching assessments</strong><span>Try another status filter or create a new synthetic case.</span></div>}
      </div>
      {selected && <article className="detail-card" aria-live="polite"><div className="detail-top"><div><p className="eyebrow">Assessment evidence</p><h2>{selected.organization_name}</h2></div><span className={`status ${selected.status === "Ready" ? "ready" : "review"}`}>{selected.status}</span></div><div className="confidence"><span>Assessment confidence</span><strong>{selected.confidence}%</strong><div><i style={{ width: `${selected.confidence}%` }} /></div></div><div className="recommendation"><span>Recommended next step</span><strong>{selected.recommendation}</strong><p>{selected.explanation}</p></div><h3>Evidence trail</h3><div className="evidence-list">{selected.evidence.map((evidence) => <div className="evidence" key={evidence.source_id}><div><strong>{evidence.source_name}</strong><p>{evidence.detail}</p><small>Source {evidence.source_id} · {new Date(evidence.observed_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</small></div><div><span className={`freshness ${evidence.freshness === "Current" ? "current" : "stale"}`}>{evidence.freshness}</span><b>{evidence.completeness}% complete</b></div></div>)}</div><button className="primary-action" onClick={() => void recordReview()}>Record review</button>{notice && <p className="notice" role="status">{notice}</p>}</article>}
    </section>
  </main>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }
