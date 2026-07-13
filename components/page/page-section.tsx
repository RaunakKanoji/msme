import type { ReactNode } from "react";
// Section scaffolding: heading + optional description, then content. Uses typography and spacing — never a card —
// so pages get hierarchy without wrapper-card soup.
export function PageSection({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return <section className="page-section"><div className="page-section-head"><div><h2 className="page-section-title">{title}</h2>{description ? <p className="page-section-description">{description}</p> : null}</div>{actions ? <div className="page-section-actions">{actions}</div> : null}</div>{children}</section>;
}
export function MetricGrid({ children, columns = 4 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  return <div className={`metric-grid metric-grid-${columns}`}>{children}</div>;
}
export function TwoColumnGrid({ children }: { children: ReactNode }) {
  return <div className="two-col-grid">{children}</div>;
}
