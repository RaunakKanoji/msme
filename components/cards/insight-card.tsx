import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Level 3 grouped insight card: one card per insight *group* (Strengths, Risks) with compact list rows — not one
// card per insight, which turns into card soup.
export type InsightType = "strength" | "risk" | "information" | "opportunity";
export type Insight = { id: string; title: string; description: string; metric?: string; value?: string };
const TYPE_META: Record<InsightType, { heading: string; badge: string; variant: "success" | "warning" | "outline" | "default" }> = {
  strength: { heading: "Strengths", badge: "Positive", variant: "success" },
  risk: { heading: "Risks", badge: "Attention", variant: "warning" },
  information: { heading: "Information", badge: "Info", variant: "outline" },
  opportunity: { heading: "Opportunities", badge: "Opportunity", variant: "outline" },
};
export function InsightsCard({ type, description, insights, emptyText }: { type: InsightType; description?: string; insights: Insight[]; emptyText?: string }) {
  const meta = TYPE_META[type];
  return <Card className="insights-card">
    <CardHeader><div><CardTitle>{meta.heading}</CardTitle>{description ? <CardDescription>{description}</CardDescription> : null}</div><Badge variant={meta.variant}>{insights.length}</Badge></CardHeader>
    <CardContent>
      {insights.length ? <ul className="insight-list">{insights.map((item) => <li key={item.id} className="insight-row"><div className="insight-row-text"><strong>{item.title}</strong><span>{item.description}</span></div>{item.value ? <span className="insight-row-value">{item.metric ? <em>{item.metric}</em> : null}{item.value}</span> : null}</li>)}</ul> : <p className="metric-card-note">{emptyText ?? "Nothing flagged for this period."}</p>}
    </CardContent>
  </Card>;
}
