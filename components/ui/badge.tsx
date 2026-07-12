import type { HTMLAttributes } from "react";
export function Badge({ className = "", variant = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "outline" }) { return <span className={`ui-badge ui-badge-${variant} ${className}`} {...props} />; }
