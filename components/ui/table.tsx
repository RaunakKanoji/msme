import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
// House-style table primitives (shadcn-compatible API). The wrapper provides horizontal scroll on small screens.
export function Table({ className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) { return <div className="ui-table-wrap"><table className={`ui-table ${className}`} {...props} /></div>; }
export function TableHeader(props: HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} />; }
export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} />; }
export function TableRow(props: HTMLAttributes<HTMLTableRowElement>) { return <tr {...props} />; }
export function TableHead({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) { return <th scope="col" className={`ui-table-head ${className}`} {...props} />; }
export function TableCell({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) { return <td className={`ui-table-cell ${className}`} {...props} />; }
