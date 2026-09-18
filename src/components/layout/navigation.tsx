"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Settings,
  User,
  Tag,
  TrendingUp,
  Megaphone,
  Store,
  GraduationCap,
  Building2,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { translateStudentName, translateMajor, getStudentInitials } from "@/lib/translations/content";

export function BottomNav() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const isAr = language === "ar";

  const mobileNavItems = [
    { href: "/", icon: LayoutDashboard, label: isAr ? "الرئيسية" : "Home" },
    { href: "/readiness", icon: TrendingUp, label: isAr ? "المسار" : "Path" },
    { href: "/deals", icon: QrCode, label: isAr ? "التذكرة" : "Ticket" },
    { href: "/internships", icon: Briefcase, label: isAr ? "التدريب" : "Career" },
    { href: "/profile", icon: User, label: isAr ? "حسابي" : "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.08] bg-[#0D0E22]/90 backdrop-blur-2xl md:hidden pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1.5 px-2 select-none shadow-2xl">
      <div className="grid grid-cols-5 w-full max-w-md mx-auto items-center">
        {mobileNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-1 px-1 transition-all duration-200 text-center group",
                isActive ? "text-white font-bold" : "text-white/45 hover:text-white/80"
              )}
            >
              {/* Neon Pink/Blue Top Indicator on Active */}
              {isActive && (
                <span className="absolute -top-1.5 h-[2.5px] w-8 rounded-full bg-gradient-to-r from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] shadow-[0_0_10px_#E83D84] animate-in fade-in zoom-in-50 duration-200" />
              )}

              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center",
                  isActive
                    ? "bg-gradient-to-tr from-[#2F7BFF]/20 to-[#E83D84]/20 text-[#38BDF8] shadow-[0_0_12px_rgba(47,123,255,0.3)]"
                    : "group-hover:bg-white/[0.04]"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110 text-white"
                  )}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </div>
              <span className={cn(
                "text-[10px] tracking-tight truncate w-full block text-center leading-none",
                isActive ? "text-white font-bold" : "text-white/50"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t, isRtl, language } = useLanguage();
  const [student, setStudent] = useState<{ name: string; major: string } | null>(null);

  const desktopNavItems = [
    { href: "/", icon: LayoutDashboard, label: t.nav.home },
    { href: "/courses", icon: BookOpen, label: t.nav.courses },
    { href: "/announcements", icon: Megaphone, label: t.nav.announcements },
    { href: "/internships", icon: Briefcase, label: t.nav.internships },
    { href: "/readiness", icon: TrendingUp, label: t.nav.readiness },
    { href: "/deals", icon: Tag, label: t.nav.deals },
    { href: "/settings", icon: Settings, label: t.nav.settings },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("masar_user_name");
      const storedMajor = localStorage.getItem("masar_user_major");
      if (storedName || storedMajor) {
        setStudent({
          name: storedName || t.common.studentNameFallback,
          major: storedMajor || t.common.studentMajorFallback,
        });
      }
    }

    fetch("/api/students/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) {
          const storedMajor = typeof window !== "undefined" ? localStorage.getItem("masar_user_major") : null;
          setStudent({
            name: data.name,
            major: storedMajor || data.major,
          });
        }
      })
      .catch(() => {});
  }, [t]);

  const rawName = student?.name || t.common.studentNameFallback;
  const rawMajor = student?.major || t.common.studentMajorFallback;
  const studentName = translateStudentName(rawName, language);
  const studentMajor = translateMajor(rawMajor, language);
  const initial = getStudentInitials(rawName, language);

  return (
    <aside className={cn(
      "hidden md:flex flex-col fixed top-0 h-full w-60 bg-card z-40 transition-all duration-150",
      isRtl ? "right-0 border-l border-border" : "left-0 border-r border-border"
    )}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <MasarLogo variant="icon" size="sm" priority />
        <span className="text-lg font-bold tracking-tight masar-gradient-text">{t.common.appName}</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {desktopNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Masar Portals Ecosystem Switcher */}
      <div className="px-3 py-3 border-t border-border/80 space-y-1.5">
        <div className="px-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          بوابات منظومة مسار
        </div>
        <div className="grid grid-cols-3 gap-1">
          <Link
            href="/merchant/login"
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/60 hover:border-amber-500/40 hover:bg-amber-500/5 text-[10px] text-muted-foreground hover:text-foreground transition-all text-center group"
            title="بوابة الشركاء ونقاط البيع"
          >
            <Store className="h-3.5 w-3.5 text-amber-500 group-hover:scale-110 transition-transform mb-0.5" />
            <span className="truncate w-full">المتجر</span>
          </Link>
          <Link
            href="/university/login"
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/60 hover:border-blue-500/40 hover:bg-blue-500/5 text-[10px] text-muted-foreground hover:text-foreground transition-all text-center group"
            title="بوابة الجامعة الأكاديمية"
          >
            <GraduationCap className="h-3.5 w-3.5 text-blue-500 group-hover:scale-110 transition-transform mb-0.5" />
            <span className="truncate w-full">الجامعة</span>
          </Link>
          <Link
            href="/company/login"
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/60 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-[10px] text-muted-foreground hover:text-foreground transition-all text-center group"
            title="بوابة الشركات والتوظيف"
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-500 group-hover:scale-110 transition-transform mb-0.5" />
            <span className="truncate w-full">الشركات</span>
          </Link>
        </div>
      </div>

      <div className="px-3 py-3 border-t border-border">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
            pathname === "/profile" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{studentName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{studentMajor}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
