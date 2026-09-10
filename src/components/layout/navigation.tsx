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

const desktopNavItems = [
  { href: "/", icon: LayoutDashboard, label: "الرئيسية" },
  { href: "/growth", icon: TrendingUp, label: "نموي الأكاديمي" },
  { href: "/courses", icon: BookOpen, label: "المواد" },
  { href: "/internships", icon: Briefcase, label: "تدريب" },
  { href: "/deals", icon: Tag, label: "العروض والخصومات" },
  { href: "/settings", icon: Settings, label: "الإعدادات" },
];

const mobileNavItems = [
  { href: "/", icon: LayoutDashboard, label: "الرئيسية" },
  { href: "/growth", icon: TrendingUp, label: "النمو" },
  { href: "/courses", icon: BookOpen, label: "المواد" },
  { href: "/internships", icon: Briefcase, label: "تدريب" },
  { href: "/deals", icon: Tag, label: "العروض" },
  { href: "/profile", icon: User, label: "حسابي" },
];

// Bottom navigation for mobile
export function BottomNav() {
  const pathname = usePathname();

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
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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

// Sidebar for desktop
export function Sidebar() {
  const pathname = usePathname();
  const [student, setStudent] = useState<{ name: string; major: string } | null>(null);

  useEffect(() => {
    // 1. قراءة التخصص والاسم فوراً من التخزين المحلي لمنع أي تأخير في العرض
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("masar_user_name");
      const storedMajor = localStorage.getItem("masar_user_major");
      if (storedName || storedMajor) {
        setStudent({
          name: storedName || "طالب مسار",
          major: storedMajor || "تكنولوجيا المعلومات",
        });
      }
    }

    // 2. جلب أحدث بيانات من الخادم بدون كاش
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
  }, []);

  const studentName = student?.name || "طالب مسار";
  const studentMajor = student?.major || "تكنولوجيا المعلومات";
  const initial = studentName[0] || "ط";

  return (
    <aside className="hidden md:flex flex-col fixed right-0 top-0 h-full w-60 border-l border-border bg-card z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <MasarLogo size="sm" priority />
        <span className="text-base font-medium tracking-tight">مسار</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {desktopNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Profile link */}
      <div className="px-3 py-4 border-t border-border">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
            pathname === "/profile"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
