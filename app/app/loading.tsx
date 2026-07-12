import { Skeleton } from "@/components/ui/skeleton";
export default function AppLoading() { return <div className="route-loading"><Skeleton className="skeleton-title" /><div className="route-loading-grid"><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /></div><Skeleton className="skeleton-panel" /></div>; }
