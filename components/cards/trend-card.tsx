import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInrCompact } from "@/lib/financial-data/format";
import type { MonthlyTrendPoint } from "@/lib/financial-data/format";
// Full-width trend card: revenue vs expenses per month as paired bars with a text summary. Values are printed as
// text (charts must not rely on colour alone), and no chart dependency is introduced.
export function TrendCard({ points, summary }: { points: MonthlyTrendPoint[]; summary: string }) {
  const max = Math.max(1, ...points.map((p) => Math.max(p.revenue, p.expenses)));
  return <Card className="trend-card">
    <CardHeader><div><CardTitle>Revenue and expenses</CardTitle><CardDescription>Monthly totals across the reporting period.</CardDescription></div><div className="trend-legend"><span className="trend-key trend-key-revenue">Revenue</span><span className="trend-key trend-key-expenses">Expenses</span></div></CardHeader>
    <CardContent>
      <div className="trend-rows">
        {points.map((p) => <div key={p.month} className="trend-row">
          <span className="trend-month">{p.label}</span>
          <div className="trend-bars">
            <div className="trend-bar-track"><div className="trend-bar trend-bar-revenue" style={{ width: `${Math.round((p.revenue / max) * 100)}%` }} /><span className="trend-bar-value">{formatInrCompact(p.revenue)}</span></div>
            <div className="trend-bar-track"><div className="trend-bar trend-bar-expenses" style={{ width: `${Math.round((p.expenses / max) * 100)}%` }} /><span className="trend-bar-value">{formatInrCompact(p.expenses)}</span></div>
          </div>
        </div>)}
      </div>
      <p className="metric-card-note trend-summary">{summary}</p>
    </CardContent>
  </Card>;
}
