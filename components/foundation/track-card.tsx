import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
export function TrackCard({ label, title, description, status }: { label: string; title: string; description: string; status: string }) { return <Card><CardHeader><StatusBadge status={label} /><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent><StatusBadge status={status} /></CardContent></Card>; }
