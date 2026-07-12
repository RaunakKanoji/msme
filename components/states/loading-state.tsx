import { Skeleton } from "@/components/ui/skeleton";
export function LoadingState({ label = "Loading…" }: { label?: string }) { return <main className="state-page"><Skeleton className="skeleton-title" /><Skeleton className="skeleton-body" /><p>{label}</p></main>; }
