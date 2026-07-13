import type { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// Level 2 supporting card: exactly one metric per card, quiet label, prominent value, semantic (not automatic)
// trend status supplied by the parent — an expense increase is not "positive" just because it went up.
export type MetricStatusVariant = "positive" | "warning" | "negative" | "neutral";
export interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: { direction: "up" | "down" | "stable"; value: string; label?: string };
  status?: MetricStatusVariant;
  footer?: ReactNode;
  loading?: boolean;
  unavailable?: boolean;
}
const ARROW: Record<"up" | "down" | "stable", string> = { up: "▲", down: "▼", stable: "▬" };
export function MetricCard({ title, value, description, trend, status = "neutral", footer, loading, unavailable }: MetricCardProps) {
  if (loading) return <MetricCardSkeleton />;
  return <Card className="metric-card">
    <CardHeader className="metric-card-header"><span className="metric-card-label">{title}</span></CardHeader>
    <CardContent className="metric-card-body">
      {unavailable ? <><span className="metric-card-value metric-unavailable">—</span><p className="metric-card-note">Not enough data for this period.</p></> : <>
        <span className={`metric-card-value metric-${status}`}>{value}</span>
        {trend ? <span className={`metric-card-trend trend-${status}`} aria-label={`Trend ${trend.direction}: ${trend.value}${trend.label ? ` ${trend.label}` : ""}`}>{ARROW[trend.direction]} {trend.value}{trend.label ? <em> {trend.label}</em> : null}</span> : null}
        {description ? <p className="metric-card-note">{description}</p> : null}
      </>}
    </CardContent>
    {footer ? <CardFooter className="metric-card-footer">{footer}</CardFooter> : null}
  </Card>;
}
export function MetricCardSkeleton() {
  return <Card className="metric-card" aria-busy="true"><CardHeader className="metric-card-header"><Skeleton className="sk-line sk-w-8" /></CardHeader><CardContent className="metric-card-body"><Skeleton className="sk-value" /><Skeleton className="sk-line sk-w-12" /></CardContent></Card>;
}
