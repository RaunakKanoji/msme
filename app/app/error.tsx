"use client";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/error-state";
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="route-error"><ErrorState message="This workspace view could not be loaded. Your session and navigation remain available." /><Button onClick={reset}>Try again</Button></div>; }
