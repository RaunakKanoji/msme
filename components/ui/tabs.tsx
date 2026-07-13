"use client";
import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from "react";
// House-style accessible tabs (shadcn-compatible API: Tabs/TabsList/TabsTrigger/TabsContent). Keyboard: arrow keys
// move between triggers; active state is exposed via aria-selected, not colour alone.
const TabsContext = createContext<{ value: string; setValue: (v: string) => void; id: string } | null>(null);
export function Tabs({ defaultValue, children, className = "" }: { defaultValue: string; children: ReactNode; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  const id = useId();
  return <TabsContext.Provider value={{ value, setValue, id }}><div className={`ui-tabs ${className}`}>{children}</div></TabsContext.Provider>;
}
export function TabsList({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={`ui-tabs-list ${className}`} onKeyDown={(event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next?.focus(); next?.click();
  }} {...props}>{children}</div>;
}
export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return <button type="button" role="tab" id={`${ctx.id}-tab-${value}`} aria-selected={active} aria-controls={`${ctx.id}-panel-${value}`} tabIndex={active ? 0 : -1} className={`ui-tabs-trigger ${active ? "active" : ""}`} onClick={() => ctx.setValue(value)}>{children}</button>;
}
export function TabsContent({ value, children, className = "" }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div role="tabpanel" id={`${ctx.id}-panel-${value}`} aria-labelledby={`${ctx.id}-tab-${value}`} className={`ui-tabs-content ${className}`}>{children}</div>;
}
