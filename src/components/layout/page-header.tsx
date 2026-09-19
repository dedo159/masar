"use client";

import Link from "next/link";
import { Moon, Sun, Globe, Menu, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { getStudentInitials } from "@/lib/translations/content";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const isDark = resolvedTheme === "dark";

  // Dynamic title mapping
  const titleMap: Record<string, string> = {
    "مسار": t.common.appName,
    "Masar": t.common.appName,
    "courses": t.courses.title,
    "المواد": t.courses.title,
    "تفاصيل المادة": t.courseDetail.scheduleTab,
    "internships": t.internships.title,
    "لوحة التدريب": t.internships.title,
    "deals": t.deals.title,
    "العروض والخصومات": t.deals.title,

    "profile": t.profile.title,
    "الملف الشخصي": t.profile.title,
    "settings": t.settings.title,
    "الإعدادات": t.settings.title,
  };

  const displayTitle = titleMap[title] || title;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all duration-300">
      {/* Mobile Top Bar (Exact Match with Official 3D Mockup) */}
      <div className="relative flex md:hidden items-center justify-between px-4 py-2.5 min-h-[56px]">
        {/* Left: Menu Hamburger */}
        <Link
          href="/settings"
          className="p-2 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted active:scale-95 transition-all z-10"
          aria-label="القائمة"
        >
          <Menu className="h-5 w-5" />
        </Link>

        {/* Center: Masar Full Logo (Centered in the middle of the screen) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link href="/" className="pointer-events-auto flex items-center justify-center hover:opacity-90 transition-opacity">
            <MasarLogo size="sm" priority />
          </Link>
        </div>

        {/* Right: Search & Notifications */}
        <div className="flex items-center gap-0.5 z-10">
          <Link
            href="/courses"
            className="p-2 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted active:scale-95 transition-all"
            aria-label="بحث"
          >
            <Search className="h-4 w-4" />
          </Link>
          <NotificationsDropdown />
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-3.5 relative min-h-[60px]">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">{displayTitle}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5" suppressHydrationWarning>
                {subtitle === "date" 
                  ? new Date().toLocaleDateString(language === "ar" ? "ar-JO" : "en-US", {
                      timeZone: "Asia/Amman",
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : (subtitle === "loading" || subtitle === "جاري التحميل..." || subtitle === "جاري تحميل البيانات...")
                  ? t.common.loading
                  : subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center: Prominent Masar Full Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link href="/" className="flex items-center justify-center hover:opacity-90 transition-opacity">
            <MasarLogo size="sm" priority />
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {action}

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 px-3 text-xs font-medium gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95"
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
            className="h-9 w-9 rounded-lg"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>

          <NotificationsDropdown />

          <Link
            href="/profile"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-sm transition-all active:scale-95 text-xs font-medium border border-border mx-1"
            title={t.header.userAccount}
            aria-label={t.header.userAccount}
            suppressHydrationWarning
          >
            {typeof window !== "undefined" && localStorage.getItem("masar_user_name")
              ? getStudentInitials(localStorage.getItem("masar_user_name"), language)
              : getStudentInitials(null, language)}
          </Link>
        </div>
      </div>
    </header>
  );
}

