import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export function ErrorState({ message }: { message: string }) { return <Alert className="error-alert"><AlertTitle>Unable to load this view</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>; }
