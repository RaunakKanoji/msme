"use client";
import { useState, type ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
export function AppShell({ children }: { children: ReactNode }) { const [collapsed, setCollapsed] = useState(false); return <div className={`app-shell-new ${collapsed ? "is-sidebar-collapsed" : ""}`}><AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} /><section className="app-content-new"><AppTopbar /><main className="app-route-content">{children}</main></section></div>; }
