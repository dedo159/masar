import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "md" | "lg" | "icon" | "icon-sm";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium select-none cursor-pointer",
          "transition-all duration-150 ease-out",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled state
          "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          // Variants
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]":
              variant === "default" || variant === "primary",
            "border border-border bg-secondary/40 text-foreground hover:bg-secondary active:scale-[0.98]":
              variant === "secondary" || variant === "outline",
            "text-foreground hover:bg-secondary/70 active:scale-[0.98]":
              variant === "ghost",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]":
              variant === "destructive",
            "text-primary underline-offset-4 hover:underline p-0 h-auto cursor-pointer":
              variant === "link",
          },
          // Sizes (touch targets: default 44px, sm 36px)
          {
            "h-11 min-h-[44px] px-4 text-sm": size === "default" || size === "md",
            "h-9 min-h-[36px] px-3 text-xs": size === "sm",
            "h-12 min-h-[48px] px-6 text-base": size === "lg",
            "h-11 w-11 min-h-[44px] min-w-[44px] p-0": size === "icon",
            "h-9 w-9 min-h-[36px] min-w-[36px] p-0": size === "icon-sm",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
