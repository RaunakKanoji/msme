"use client";
// 05-011 Borrower Health Card View — supportive, plain-language presentation. Presentational only; the workspace
// fetches the data. Shows approved explanations, never model internals, weights, or raw payloads.
export type BorrowerView = { headline: string; band: "Healthy" | "Watch" | "Stress"; overall_score: number; summary: string; strengths: string[]; focus_areas: string[]; next_actions: string[]; confidence: number; freshness: string; completeness: number; explanation: string };
const bandClass = (band: string) => (band === "Healthy" ? "ready" : "review");
export default function BorrowerHealthCardView({ view }: { view: BorrowerView }) {
  return <>
    <section className="metrics">
      <article className="metric"><span>Overall band</span><strong><span className={`status ${bandClass(view.band)}`}>{view.band}</span></strong><small>{view.overall_score}/100 · plain-language view</small></article>
      <article className="metric"><span>Confidence</span><strong>{view.confidence}%</strong><small>{view.freshness} data</small></article>
      <article className="metric"><span>Data completeness</span><strong>{view.completeness}%</strong><small>From your connected sources</small></article>
    </section>
    <section className="detail-card"><div className="recommendation"><span>{view.band}</span><strong>{view.headline}</strong><p>{view.summary}</p></div></section>
    <section className="content-grid">
      <article className="detail-card"><div className="detail-top"><div><p className="eyebrow">Strengths</p><h2>What is going well</h2></div></div>{view.strengths.length ? <ul>{view.strengths.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="address-missing">Strengths appear once your card is ready.</p>}</article>
      <article className="detail-card"><div className="detail-top"><div><p className="eyebrow">Focus areas</p><h2>What to work on</h2></div></div>{view.focus_areas.length ? <ul>{view.focus_areas.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="address-missing">No focus areas flagged yet.</p>}</article>
    </section>
    <article className="detail-card"><div className="detail-top"><div><p className="eyebrow">Next steps</p><h2>Suggested actions</h2></div></div><ol>{view.next_actions.map((item) => <li key={item}>{item}</li>)}</ol></article>
    <p className="redaction-note">{view.explanation}</p>
  </>;
}
