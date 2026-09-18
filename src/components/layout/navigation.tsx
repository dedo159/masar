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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { translateStudentName, translateMajor, getStudentInitials } from "@/lib/translations/content";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mobileNavItems = [
    { href: "/", icon: LayoutDashboard, label: t.nav.homeShort || t.nav.home },
    { href: "/courses", icon: BookOpen, label: t.nav.courses },
    { href: "/announcements", icon: Megaphone, label: t.nav.announcementsShort || t.nav.announcements },
    { href: "/internships", icon: Briefcase, label: t.nav.internshipsShort || t.nav.internships },
    { href: "/readiness", icon: TrendingUp, label: t.nav.readinessShort || t.nav.readiness },
    { href: "/deals", icon: Tag, label: t.nav.dealsShort },
    { href: "/profile", icon: User, label: t.nav.profileShort || t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden pb-[max(env(safe-area-inset-bottom,0px),6px)] pt-1 px-0.5 select-none shadow-md">
      <div className="grid grid-cols-7 w-full max-w-full items-center">
        {mobileNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 px-0.5 min-w-0 transition-all duration-150 text-center group",
                isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-md transition-all duration-150 flex items-center justify-center",
                  isActive ? "bg-primary/10 text-primary" : "group-hover:bg-muted"
                )}
              >
                <Icon
                  className={cn("h-4.5 w-4.5 transition-transform duration-150 flex-shrink-0", isActive && "scale-105")}
                  strokeWidth={isActive ? 2.2 : 1.7}
                />
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-medium tracking-tight truncate w-full block text-center leading-none mt-0.5">
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
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <MasarLogo size="sm" priority />
        <span className="text-base font-medium tracking-tight">{t.common.appName}</span>
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
