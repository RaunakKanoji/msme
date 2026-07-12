import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function ComingSoonState({ title, description, track, folder }: { title: string; description: string; track: string; folder: string }) { return <main className="app-page"><Card className="coming-soon-new"><CardHeader><Badge variant="warning">Status: upcoming implementation</Badge><CardTitle>{title}</CardTitle></CardHeader><CardContent><p>{description}</p><Alert><AlertTitle>{track}</AlertTitle><AlertDescription>Implementation is planned in <strong>{folder}</strong>. This prototype contains no live data integration, score, prediction, or lending decision.</AlertDescription></Alert><Link href="/app"><Button>Return to overview</Button></Link></CardContent></Card></main>; }
