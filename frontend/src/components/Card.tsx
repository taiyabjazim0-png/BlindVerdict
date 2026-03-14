import { cn } from "@/utils/cn";

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm", className)} {...rest}>
      {children}
    </div>
  );
}
