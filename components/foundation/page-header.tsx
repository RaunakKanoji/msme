import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) { return <header className="page-header"><div>{eyebrow && <Badge variant="outline">{eyebrow}</Badge>}<h1>{title}</h1><p>{description}</p></div>{action && <div>{action}</div>}</header>; }
