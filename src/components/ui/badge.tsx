import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "danger"
  | "success"
  | "warning"
  | "neutral"
  | "completed"
  | "remaining"
  | "urgent";

export interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset select-none",
        "transition-colors duration-150 ease-out",
        {
          // Default / Primary
          "bg-primary/10 text-primary ring-primary/20":
            variant === "default",
          // Secondary / Neutral / Remaining (متبقي)
          "bg-secondary text-secondary-foreground ring-border":
            variant === "secondary" || variant === "neutral" || variant === "remaining",
          // Destructive / Danger / Urgent (عاجل)
          "bg-destructive/10 text-destructive ring-destructive/20":
            variant === "destructive" || variant === "danger" || variant === "urgent",
          // Outline
          "bg-transparent text-foreground ring-border":
            variant === "outline",
          // Success / Completed (مكتمل)
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20":
            variant === "success" || variant === "completed",
          // Warning
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20":
            variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
