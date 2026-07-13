import { SpecRecordsPage } from "@/components/platform/spec-records-page";
import { store } from "@/lib/platform-specs/prediction-failure-runbook";
export default function Page() { return <SpecRecordsPage title="Prediction failure runbook" description="Scoring degradation and rollback procedures." records={store.list().records} />; }
