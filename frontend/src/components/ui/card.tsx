import { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export function UICard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-soft", className)} />;
}
