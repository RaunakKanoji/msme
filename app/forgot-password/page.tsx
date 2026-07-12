import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function ForgotPasswordPage() { return <main className="auth-new"><Card><CardHeader><p className="auth-brand">MSME Arogya360</p><CardTitle>Reset your password</CardTitle><CardDescription>Continue to the secure Clerk flow to request a password reset.</CardDescription></CardHeader><CardContent><Alert><AlertTitle>Secure account recovery</AlertTitle><AlertDescription>Use your registered account details in the managed sign-in flow. This app does not process password data directly.</AlertDescription></Alert><SignInButton><Button>Continue to secure sign-in</Button></SignInButton><Link href="/signin"><Button variant="outline">Return to sign in</Button></Link></CardContent></Card></main>; }
