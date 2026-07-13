import MsmeProfileWorkspace from "@/components/bank/msme-profile-workspace";
export default async function BankMsmeProfilePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <MsmeProfileWorkspace msmeId={id} />; }
