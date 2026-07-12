import type { ButtonHTMLAttributes } from "react";
type Variant = "default" | "outline" | "destructive" | "ghost";
export function Button({ className = "", variant = "default", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) { return <button className={`ui-button ui-button-${variant} ${className}`} {...props} />; }
