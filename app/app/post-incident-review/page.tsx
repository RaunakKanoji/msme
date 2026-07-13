import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/post-incident-review";
export default function Page() { return <SpecRecordsPage title="Post-incident reviews" description="Blameless reviews linking runbook versions." records={store.list().records} />; }
