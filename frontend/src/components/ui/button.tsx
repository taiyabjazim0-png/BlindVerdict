import { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60",
        className
      )}
    />
  );
}
