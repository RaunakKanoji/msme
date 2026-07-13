import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// One grouped recommendations card containing the top actions — never ten separate recommendation cards.
export type Recommendation = { id: string; title: string; detail: string; priority: "high" | "medium" | "low"; impact?: string };
const PRIORITY: Record<Recommendation["priority"], { label: string; variant: "warning" | "outline" }> = { high: { label: "High", variant: "warning" }, medium: { label: "Medium", variant: "outline" }, low: { label: "Low", variant: "outline" } };
export function RecommendationsCard({ recommendations, limit = 3 }: { recommendations: Recommendation[]; limit?: number }) {
  const items = recommendations.slice(0, limit);
  return <Card className="recommendations-card">
    <CardHeader><div><CardTitle>Recommended actions</CardTitle><CardDescription>The highest-impact steps for this reporting period.</CardDescription></div></CardHeader>
    <CardContent>
      {items.length ? <ol className="recommendation-list">{items.map((item) => <li key={item.id} className="recommendation-row"><div className="recommendation-row-head"><strong>{item.title}</strong><Badge variant={PRIORITY[item.priority].variant}>{PRIORITY[item.priority].label} priority</Badge></div><p>{item.detail}</p>{item.impact ? <p className="metric-card-note">{item.impact}</p> : null}</li>)}</ol> : <p className="metric-card-note">No actions recommended for this period.</p>}
    </CardContent>
  </Card>;
}
