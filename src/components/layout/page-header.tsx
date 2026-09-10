"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown";
import { MasarLogo } from "@/components/ui/logo";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          {title === "مسار" && (
            <div className="md:hidden flex items-center">
              <MasarLogo size="sm" priority />
            </div>
          )}
          <div>
            <h1 className="text-base font-medium">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {action}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="تبديل الوضع"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>
          <NotificationsDropdown />
          <Link
            href="/profile"
            className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-medium border border-border mr-1"
            title="حساب المستخدم"
            aria-label="حساب المستخدم"
          >
            ض
          </Link>
        </div>
      </div>
    </header>
  );
}
