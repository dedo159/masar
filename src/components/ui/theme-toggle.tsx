"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "التحويل للوضع الفاتح" : "التحويل للوضع الداكن"}
      title={isDark ? "التحويل للوضع الفاتح" : "التحويل للوضع الداكن"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-foreground/80 hover:text-foreground transition-colors" strokeWidth={1.5} />
      ) : (
        <Moon className="h-4 w-4 text-foreground/80 hover:text-foreground transition-colors" strokeWidth={1.5} />
      )}
    </Button>
  );
}
