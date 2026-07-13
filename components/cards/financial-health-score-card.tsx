import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DataSourceBadge, type DataSourceInfo } from "@/components/financial-data/data-source-badge";
// Level 1 primary card: the single most important number on the page. Text category always accompanies the score —
// never colour alone. One primary action maximum.
const CATEGORY_LABEL: Record<string, string> = { excellent: "Excellent", healthy: "Healthy", stable: "Stable", "needs-attention": "Needs attention", critical: "Critical" };
export interface FinancialHealthScoreCardProps {
  score: number;
  category: string;
  description: string;
  reportingPeriod: string;
  dataCompleteness: number;
  source: DataSourceInfo;
  detailHref?: string;
  change?: number;
}
export function FinancialHealthScoreCard({ score, category, description, reportingPeriod, dataCompleteness, source, detailHref, change }: FinancialHealthScoreCardProps) {
  const label = CATEGORY_LABEL[category] ?? category;
  return <Card className="score-card">
    <CardHeader className="score-card-header">
      <div><CardTitle>Financial health score</CardTitle><CardDescription>{reportingPeriod}</CardDescription></div>
      <div className="score-card-badges"><Badge variant={score >= 68 ? "success" : "warning"}>{label}</Badge><DataSourceBadge source={source} /></div>
    </CardHeader>
    <CardContent className="score-card-body">
      <div className="score-card-value"><span className="score-card-number">{score}</span><span className="score-card-denominator">/100</span>{typeof change === "number" && change !== 0 ? <span className={`score-card-change ${change > 0 ? "trend-positive" : "trend-negative"}`}>{change > 0 ? "▲" : "▼"} {Math.abs(change)} pts</span> : null}</div>
      <Progress value={score} label="Overall financial health score" />
      <p className="score-card-summary">{description}</p>
    </CardContent>
    <CardFooter className="score-card-footer">
      <span className="metric-card-note">Data completeness {dataCompleteness}%</span>
      {detailHref ? <Link href={detailHref}><Button variant="outline">View detailed analysis</Button></Link> : null}
    </CardFooter>
  </Card>;
}
export function ScoreCardSkeleton() {
  return <Card className="score-card" aria-busy="true"><CardHeader className="score-card-header"><div><Skeleton className="sk-line sk-w-12" /><Skeleton className="sk-line sk-w-8" /></div></CardHeader><CardContent className="score-card-body"><Skeleton className="sk-score" /><Skeleton className="sk-line" /><Skeleton className="sk-line sk-w-16" /></CardContent></Card>;
}
