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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mobileNavItems = [
    { href: "/", icon: LayoutDashboard, label: t.nav.home },
    { href: "/growth", icon: TrendingUp, label: t.nav.growthShort },
    { href: "/courses", icon: BookOpen, label: t.nav.courses },
    { href: "/internships", icon: Briefcase, label: t.nav.internships },
    { href: "/deals", icon: Tag, label: t.nav.dealsShort },
    { href: "/profile", icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {mobileNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-all duration-150",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn("h-5 w-5 transition-all duration-150", isActive && "scale-110")}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t, isRtl } = useLanguage();
  const [student, setStudent] = useState<{ name: string; major: string } | null>(null);

  const desktopNavItems = [
    { href: "/", icon: LayoutDashboard, label: t.nav.home },
    { href: "/growth", icon: TrendingUp, label: t.nav.growth },
    { href: "/courses", icon: BookOpen, label: t.nav.courses },
    { href: "/internships", icon: Briefcase, label: t.nav.internships },
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

  const studentName = student?.name || t.common.studentNameFallback;
  const studentMajor = student?.major || t.common.studentMajorFallback;
  const initial = studentName[0] || (isRtl ? "ط" : "S");

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

      <div className="px-3 py-4 border-t border-border">
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
