"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAVIGATION } from "@/lib/constants/navigation";
const icons: Record<string, string> = { Overview: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z", Onboarding: "M5 4h14v4H5V4Zm0 6h14v10H5V10Zm3 3h8M8 16h5", "Financial Health": "M4 18V6m5 12V9m5 9V4m5 14v-7", "Default Risk": "M12 3 3 20h18L12 3Zm0 6v5m0 3h.01", Documents: "M7 3h7l5 5v13H7V3Zm7 0v5h5M9 13h6M9 17h6", Reports: "M5 19V5h14v14H5Zm4-3v-4m3 4V8m3 8v-6", Settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M3 12h3m12 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" };
function NavIcon({ title }: { title: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={icons[title] || icons.Overview} /></svg>; }
export function SidebarNavigation() { const pathname = usePathname(); return <nav aria-label="Workspace navigation">{APP_NAVIGATION.map((item) => { const active = item.href === "/app" ? pathname === "/app" : pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} title={item.title} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><NavIcon title={item.title} /><span>{item.title}</span></Link>; })}</nav>; }
