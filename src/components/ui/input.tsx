import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        ref={ref}
        className={cn(
          "flex h-11 min-h-[44px] w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm ring-offset-background",
          "text-foreground placeholder:text-muted-foreground",
          "transition-all duration-150 ease-out",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Error state
          error && "border-destructive text-destructive-foreground focus-visible:ring-destructive",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // RTL text alignment friendliness
          "text-start",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
