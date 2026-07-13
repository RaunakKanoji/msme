import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Reusable empty state: explains what is missing, why it matters, and what to do next — never a bare "No data".
export function EmptyStateCard({ title, description, actionLabel, actionHref }: { title: string; description: string; actionLabel?: string; actionHref?: string }) {
  return <Card className="empty-state-card"><CardContent className="empty-state-body"><strong>{title}</strong><p>{description}</p>{actionLabel && actionHref ? <Link href={actionHref}><Button variant="outline">{actionLabel}</Button></Link> : null}</CardContent></Card>;
}
