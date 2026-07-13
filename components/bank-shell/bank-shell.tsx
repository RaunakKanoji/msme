"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
// Bank operations shell — reference-style dark sectioned sidebar with a light content topbar carrying the bank
// chip and the signed-in identity. One persistent shell for every /bank route; nav lists only routes that exist.
const SECTIONS: Array<{ label: string; items: Array<{ title: string; href: string; icon: string }> }> = [
  {
    label: "Platform",
    items: [
      { title: "Overview", href: "/bank", icon: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" },
      { title: "MSME Registry", href: "/bank/msmes", icon: "M4 6h16M4 12h16M4 18h16" },
      { title: "Applications", href: "/bank/applications", icon: "M7 3h7l5 5v13H7V3Zm7 0v5h5M9 13h6M9 17h6" },
      { title: "Alerts", href: "/bank/alerts", icon: "M12 3 3 20h18L12 3Zm0 6v5m0 3h.01" },
      { title: "Reports", href: "/bank/reports", icon: "M5 19V5h14v14H5Zm4-3v-4m3 4V8m3 8v-6" },
      { title: "Data Connections", href: "/bank/data-connections", icon: "M8 7h8M8 12h8M8 17h5M4 4h16v16H4V4Z" },
    ],
  },
  {
    label: "My workspace",
    items: [
      { title: "Add MSME", href: "/bank/msmes/new", icon: "M12 5v14m-7-7h14" },
    ],
  },
];
export function BankShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="bank-shell">
    <aside className="bank-sidebar">
      <Link className="bank-wordmark" href="/bank" aria-label="MSME Arogya360 bank portal"><span>360</span><b>MSME Arogya360</b></Link>
      {SECTIONS.map((section) => <nav key={section.label} aria-label={section.label} className="bank-nav-section">
        <p>{section.label}</p>
        {section.items.map((item) => { const active = item.href === "/bank" ? pathname === "/bank" : pathname.startsWith(item.href) && !(item.href === "/bank/msmes" && pathname.startsWith("/bank/msmes/new")); return <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><svg aria-hidden="true" viewBox="0 0 24 24"><path d={item.icon} /></svg><span>{item.title}</span></Link>; })}
      </nav>)}
      <div className="bank-sidebar-foot"><Link href="/app/settings"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M3 12h3m12 0h3" /></svg><span>Settings</span></Link></div>
    </aside>
    <section className="bank-content">
      <header className="bank-topbar">
        <Badge variant="outline">IDBI Bank · demo data</Badge>
        <div className="bank-topbar-user"><UserButton /><span><strong>Bank user</strong><small>Relationship Manager · demo role</small></span></div>
      </header>
      <main className="app-route-content">{children}</main>
    </section>
  </div>;
}
