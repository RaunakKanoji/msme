import type { ReactNode } from "react";
import { BankShell } from "@/components/bank-shell/bank-shell";
export default function BankLayout({ children }: { children: ReactNode }) { return <BankShell>{children}</BankShell>; }
