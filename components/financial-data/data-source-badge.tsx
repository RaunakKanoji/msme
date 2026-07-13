import { Badge } from "@/components/ui/badge";
// Compact, text-labelled data-source indicator (never colour alone). Makes live / cached / demo explicit everywhere
// financial figures appear, so fallback data is never silently presented as real bank data.
export type DataSourceInfo = { provider: string; status: "live" | "cached" | "demo" | "manual"; isStale?: boolean; message?: string };
const MAP: Record<DataSourceInfo["status"], { label: string; variant: "success" | "warning" | "outline" }> = {
  live: { label: "Live bank data", variant: "success" },
  cached: { label: "Saved snapshot", variant: "warning" },
  demo: { label: "Demo data", variant: "outline" },
  manual: { label: "Manual data", variant: "outline" },
};
export function DataSourceBadge({ source }: { source: DataSourceInfo }) {
  const meta = MAP[source.status] ?? MAP.demo;
  return <Badge variant={meta.variant} title={source.message}>{meta.label}{source.isStale ? " · stale" : ""}</Badge>;
}
