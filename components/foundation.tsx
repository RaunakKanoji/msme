import Link from "next/link";
import type { ReactNode } from "react";

export const TRACKS = [
  { number: "Track 03", title: "MSME Financial Health Card", text: "Current financial health and credit readiness from permitted alternate-data evidence.", tone: "green" },
  { number: "Track 04", title: "12-month Credit Risk Intelligence", text: "Future stress and default-risk decision support with explainable early-warning context.", tone: "orange" },
] as const;

export function BrandGradient() { return <div className="brand-gradient" aria-hidden="true" />; }
export function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) { return <header className="section-header"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</header>; }
export function TrackCard({ track }: { track: (typeof TRACKS)[number] }) { return <article className={`track-card ${track.tone}`}><p>{track.number}</p><h3>{track.title}</h3><span>{track.text}</span></article>; }
export function InfoBanner({ children }: { children: ReactNode }) { return <div className="info-banner" role="note">{children}</div>; }
export function ComingSoon({ title, description, folder }: { title: string; description: string; folder: string }) { return <main className="workspace"><section className="coming-soon"><p className="eyebrow">Planned module</p><h1>{title}</h1><p>{description}</p><InfoBanner>Implementation is planned in <strong>{folder}</strong>. This preview contains no live data integrations, scoring, or lending decision.</InfoBanner><Link className="landing-cta" href="/app">Return to overview</Link></section></main>; }
