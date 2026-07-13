import HealthCardWorkspace from "@/components/health-card-workspace";
export default async function BusinessHealthCardPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <HealthCardWorkspace businessId={id} />; }
