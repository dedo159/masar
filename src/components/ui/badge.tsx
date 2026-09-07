import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
        {
          "bg-primary/10 text-primary ring-primary/20": variant === "default",
          "bg-secondary text-secondary-foreground ring-border": variant === "secondary",
          "bg-destructive/10 text-destructive ring-destructive/20": variant === "destructive",
          "bg-transparent text-foreground ring-border": variant === "outline",
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20": variant === "success",
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
