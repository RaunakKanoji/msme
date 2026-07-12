import type { HTMLAttributes } from "react";
export function Alert({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div role="note" className={`ui-alert ${className}`} {...props} />; }
export function AlertTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 className={`ui-alert-title ${className}`} {...props} />; }
export function AlertDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={`ui-alert-description ${className}`} {...props} />; }
