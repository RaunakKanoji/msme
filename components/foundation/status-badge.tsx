import { Badge } from "@/components/ui/badge";
export function StatusBadge({ status }: { status: string }) { const variant = /ready|verified|current|complete/i.test(status) ? "success" : /review|stale|attention|upcoming/i.test(status) ? "warning" : "outline"; return <Badge variant={variant}>{status}</Badge>; }
