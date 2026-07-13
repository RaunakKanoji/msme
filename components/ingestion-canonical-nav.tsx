"use client";
import Link from "next/link";
// Shared navigation across the 04-ingestion-canonical-model batch surfaces so each workspace is reachable from a
// relevant navigation path (REQ-03 / AC-01) without bloating the global sidebar.
const items = [
  { href: "/app/raw-source-vault", label: "Raw vault" },
  { href: "/app/canonical-party-model", label: "Party" },
  { href: "/app/canonical-bank-transactions", label: "Bank txns" },
  { href: "/app/canonical-invoices", label: "Invoices" },
  { href: "/app/canonical-gst-filings", label: "GST" },
  { href: "/app/canonical-payroll", label: "Payroll" },
  { href: "/app/canonical-obligations", label: "Obligations" },
  { href: "/app/data-quality-rules", label: "Quality" },
  { href: "/app/reconciliation-engine", label: "Reconciliation" },
  { href: "/app/feature-snapshot-builder", label: "Snapshots" },
];
export function IngestionCanonicalNav({ active }: { active: string }) {
  return <nav className="workspace-nav" aria-label="Ingestion and canonical model navigation">{items.map((item) => <Link key={item.href} className={item.href === active ? "active" : ""} href={item.href}>{item.label}</Link>)}</nav>;
}
