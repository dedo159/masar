"use client";

import Link from "next/link";
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown";
import { MasarLogo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { getStudentInitials } from "@/lib/translations/content";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { language, t } = useLanguage();

  // Dynamic title mapping
  const titleMap: Record<string, string> = {
    "مسار": t.common.appName,
    "Masar": t.common.appName,
    "courses": t.courses.title,
    "المواد": t.courses.title,
    "المواد المسجلة": t.courses.title,
    "تفاصيل المادة": t.courseDetail.scheduleTab,
    "internships": t.internships.title,
    "لوحة التدريب": t.internships.title,
    "deals": t.deals.title,
    "العروض والخصومات": t.deals.title,
    "التذكرة": t.deals.title,
    "profile": t.profile.title,
    "الملف الشخصي": t.profile.title,
    "settings": t.settings.title,
    "الإعدادات": t.settings.title,
  };

  const displayTitle = titleMap[title] || title;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all duration-300">
      {/* Mobile Top Bar */}
      <div className="relative flex md:hidden items-center justify-between px-3 py-2 min-h-[56px]">
        {/* Left: Spacer to keep logo perfectly centered */}
        <div className="w-16 flex items-center" />

        {/* Center: Masar Full Logo (Centered with safe margins so buttons never overlap) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
          <Link href="/" className="pointer-events-auto flex items-center justify-center hover:opacity-90 transition-opacity max-w-[140px]">
            <MasarLogo size="sm" priority />
          </Link>
        </div>

        {/* Right: Theme Toggle & Notifications Bell (Side-by-side, matching button style) */}
        <div className="flex items-center gap-1 z-10">
          <ThemeToggle />
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

        <div className="flex items-center gap-2">
          {action}

          {/* Theme Toggle matching Notifications Bell button style */}
          <ThemeToggle />

          <NotificationsDropdown />

          <Link
            href="/profile"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-sm transition-all active:scale-95 text-xs font-semibold border border-border mx-0.5"
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

