"use client";
// 05-012 Analyst Health Card View — detailed, reviewable presentation with per-dimension evidence. Presentational
// only; the workspace fetches the data and owns the publish action. Bands are text labels, not colour alone.
export type AnalystDimensionRow = { label: string; score: number; band: "Healthy" | "Watch" | "Stress"; confidence: number; freshness: string };
export type AnalystView = { id: string; status: "Published" | "Needs review" | "Draft"; overall_score: number; band: "Healthy" | "Watch" | "Stress"; review_status: "Ready" | "Needs review"; dimensions: AnalystDimensionRow[]; follow_ups: string[]; confidence: number; data_sufficiency: number; freshness: string; completeness: number; explanation: string };
const bandClass = (band: string) => (band === "Healthy" ? "ready" : "review");
export default function AnalystHealthCardView({ view, onPublish, busy }: { view: AnalystView; onPublish: () => void; busy: boolean }) {
  return <>
    <section className="metrics">
      <article className="metric"><span>Overall score</span><strong>{view.overall_score}/100</strong><small><span className={`status ${bandClass(view.band)}`}>{view.band}</span></small></article>
      <article className="metric"><span>Data sufficiency</span><strong>{view.data_sufficiency}%</strong><small>{view.freshness} sources</small></article>
      <article className="metric"><span>Review status</span><strong>{view.review_status}</strong><small>Confidence {view.confidence}%</small></article>
    </section>
    <section className="detail-card address-table-card"><div className="detail-top"><div><p className="eyebrow">Dimension breakdown</p><h2>Explainable scores</h2></div></div>{view.dimensions.length ? <div className="address-table-wrap"><table><thead><tr><th scope="col">Dimension</th><th scope="col">Score</th><th scope="col">Band</th><th scope="col">Confidence</th><th scope="col">Freshness</th></tr></thead><tbody>{view.dimensions.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.score}/100</td><td><span className={`status ${bandClass(row.band)}`}>{row.band}</span></td><td>{row.confidence}%</td><td><span className={`freshness ${row.freshness.toLowerCase()}`}>{row.freshness}</span></td></tr>)}</tbody></table></div> : <section className="empty-state"><strong>No dimensions published yet</strong><span>Publish dimension scores to populate the breakdown.</span></section>}</section>
    <article className="detail-card"><div className="detail-top"><div><p className="eyebrow">Analyst follow-ups</p><h2>Before relying on this card</h2></div><span className={`status ${view.review_status === "Ready" ? "ready" : "review"}`}>{view.review_status}</span></div><ul>{view.follow_ups.map((item) => <li key={item}>{item}</li>)}</ul><div className="button-row">{view.status !== "Published" ? <button className="ui-button consent-action" disabled={busy} onClick={onPublish}>Publish card</button> : <button className="ui-button ui-button-outline" disabled>Published</button>}</div></article>
    <p className="redaction-note">{view.explanation}</p>
  </>;
}
