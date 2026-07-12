import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`ui-input ${className}`} {...props} />; }
export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) { return <label className={`ui-label ${className}`} {...props} />; }
export function Checkbox({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`ui-checkbox ${className}`} type="checkbox" {...props} />; }
