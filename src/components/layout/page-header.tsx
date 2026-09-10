"use client";

import Link from "next/link";
import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const isDark = resolvedTheme === "dark";

  // If title is "مسار" or "Masar", localize it dynamically
  const displayTitle = (title === "مسار" || title === "Masar") ? t.common.appName : title;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          {(title === "مسار" || title === "Masar") && (
            <div className="md:hidden flex items-center">
              <MasarLogo size="sm" priority />
            </div>
          )}
          <div>
            <h1 className="text-base font-medium">{displayTitle}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subtitle === "date" 
                  ? new Date().toLocaleDateString(language === "ar" ? "ar-JO" : "en-US", {
                      timeZone: "Asia/Amman",
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {action}

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 px-2.5 text-xs font-medium gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
            aria-label={t.header.toggleLang}
            title={t.header.toggleLang}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{language === "ar" ? "EN" : "عربي"}</span>
          </Button>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={t.header.toggleTheme}
            title={t.header.toggleTheme}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>
          <NotificationsDropdown />
          <Link
            href="/profile"
            className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-medium border border-border mr-1 ml-1"
            title={t.header.userAccount}
            aria-label={t.header.userAccount}
          >
            ض
          </Link>
        </div>
      </div>
    </header>
  );
}
