import { Skeleton } from "@/components/ui/skeleton";
// Route-level skeleton matching the Financial Health layout (not a generic full-page spinner).
export default function FinancialHealthLoading() {
  return <div className="app-overview" aria-busy="true" aria-live="polite"><Skeleton className="skeleton-header" /><div className="two-grid"><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /></div><div className="dashboard-grid"><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /><Skeleton className="skeleton-card" /></div></div>;
}
