"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface ThemeLanguageToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "pill" | "separated" | "floating";
  showLabels?: boolean;
}

export function ThemeLanguageToggle({
  className,
  size = "md",
  variant = "pill",
  showLabels = true,
}: ThemeLanguageToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border border-border/70 dark:border-white/10 bg-card/80 dark:bg-white/[0.04] p-1 opacity-60 pointer-events-none",
          className
        )}
      >
        <div className="h-7 w-12" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "floating") {
    return (
      <div
        className={cn(
          "fixed bottom-20 md:bottom-6 z-40 transition-all duration-300 pointer-events-auto",
          isRtl ? "left-4 md:left-6" : "right-4 md:right-6",
          className
        )}
      >
        <div className="flex items-center gap-1.5 p-1 rounded-full border border-border/80 dark:border-white/15 bg-background/90 dark:bg-[#0D0E22]/90 backdrop-blur-2xl shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-[#2F7BFF]/50 transition-all">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={language === "ar" ? "Switch to English" : "التحويل إلى العربية"}
            aria-label="تبديل اللغة"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-foreground/85 hover:text-foreground hover:bg-muted dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-[#2F7BFF] dark:text-[#38BDF8]" />
            <span className="font-mono">{language === "ar" ? "EN" : "عربي"}</span>
          </button>

          <span className="h-4 w-px bg-border dark:bg-white/15" />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "التحويل للوضع النهاري (Light)" : "التحويل للوضع الليلي (Dark)"}
            aria-label="تبديل المظهر"
            className="p-1.5 rounded-full text-foreground/85 hover:text-foreground hover:bg-muted dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#2F7BFF]" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-1 shadow-xs backdrop-blur-xl transition-all duration-200 hover:border-[#2F7BFF]/40",
        size === "sm" ? "h-8" : size === "lg" ? "h-11 px-1.5" : "h-9 px-1",
        className
      )}
    >
      {/* Language Toggle Button */}
      <button
        type="button"
        onClick={toggleLanguage}
        title={language === "ar" ? "التبديل إلى English" : "Switch to العربية"}
        aria-label="تبديل اللغة"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-150 active:scale-95 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/[0.06]",
          size === "sm" ? "px-2 text-[11px] h-6" : size === "lg" ? "px-3.5 text-sm h-9 gap-2" : "px-2.5 text-xs h-7"
        )}
      >
        <Globe
          className={cn(
            "text-[#2F7BFF] dark:text-[#38BDF8] shrink-0",
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
          )}
        />
        {showLabels && (
          <span className={cn("font-mono tracking-tight font-bold", size === "lg" ? "text-xs" : "text-[11px]")}>
            {language === "ar" ? "EN" : "عربي"}
          </span>
        )}
      </button>

      {/* Subtle Hairline Divider */}
      <span
        className={cn(
          "w-px bg-border/80 dark:bg-white/10 mx-0.5",
          size === "lg" ? "h-4.5" : "h-3.5"
        )}
      />

      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
        aria-label="تبديل المظهر"
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/[0.06]",
          size === "sm" ? "h-6 w-6" : size === "lg" ? "h-9 w-9" : "h-7 w-7"
        )}
      >
        {isDark ? (
          <Sun
            className={cn(
              "text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45",
              size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4.5 w-4.5" : "h-3.5 w-3.5"
            )}
          />
        ) : (
          <Moon
            className={cn(
              "text-[#2F7BFF] transition-transform duration-200 rotate-0 hover:-rotate-12",
              size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4.5 w-4.5" : "h-3.5 w-3.5"
            )}
          />
        )}
      </button>
    </div>
  );
}
