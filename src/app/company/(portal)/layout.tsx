"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  LogOut,
  Sparkles,
  Kanban,
  Sun,
  Moon,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MasarLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CompanyPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [loggingOut, setLoggingOut] = useState(false);
  const [companyName, setCompanyName] = useState<string>("شركة تقنية");
  const [recruiterName, setRecruiterName] = useState<string>("مسؤول التوظيف");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompany = localStorage.getItem("masar_company_name");
      const storedRecruiter = localStorage.getItem("masar_recruiter_name");
      if (storedCompany) setCompanyName(storedCompany);
      if (storedRecruiter) setRecruiterName(storedRecruiter);
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/company/auth/logout", { method: "POST" });
      router.push("/company/login");
      router.refresh();
    } catch {
      router.push("/company/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    {
      href: "/company/dashboard",
      label: "لوحة البيانات",
      icon: LayoutDashboard,
    },
    {
      href: "/company/talents",
      label: "استقطاب الكفاءات",
      icon: Sparkles,
    },
    {
      href: "/company/ats",
      label: "مسار التوظيف (ATS)",
      icon: Kanban,
    },
    {
      href: "/company/analytics",
      label: "التحليلات ومؤشرات التوظيف",
      icon: BarChart3,
    },
    {
      href: "/company/internships",
      label: "فرص التدريب",
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row" dir="rtl">
      {/* Desktop Sidebar — Matching Masar Core App Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-card border-l border-border fixed top-0 bottom-0 right-0 z-40">
        {/* Brand Header with MasarLogo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <MasarLogo variant="icon" size="sm" priority />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight masar-gradient-text">مسار</span>
            <span className="text-[11px] text-muted-foreground font-medium">بوابة الشركات والتوظيف</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/company/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#2F7BFF]/25 to-[#E83D84]/15 text-white border border-[#2F7BFF]/40 shadow-[0_0_20px_rgba(47,123,255,0.2)]"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[#38BDF8]" : "text-white/60")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Recruiter Identity & Logout in Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#2F7BFF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(47,123,255,0.3)]">
              {companyName.charAt(0) || "ش"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">{companyName}</span>
              <span className="text-[10px] text-muted-foreground truncate">{recruiterName}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pr-60 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-2 md:hidden">
            <MasarLogo variant="icon" size="xs" />
            <span className="font-bold text-sm tracking-tight masar-gradient-text">مسار للأعمال</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-tight">
              مسار للأعمال
            </span>
            <span className="text-xs text-white/50 font-normal">
              · منصة استقطاب وتوظيف الكفاءات الجامعية
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="تبديل المظهر"
              title="تبديل المظهر"
              className="h-9 w-9 rounded-xl border border-white/10 hover:bg-white/[0.06]"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Company Badge Pill on Header */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white text-xs">
              <Building2 className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span className="font-semibold text-[11px]">{companyName}</span>
            </div>

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="md:hidden px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
            >
              خروج
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0C1E]/95 backdrop-blur-2xl border-t border-white/[0.08] flex justify-around p-2 z-40 shadow-2xl">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/company/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-1.5 px-3 rounded-xl text-[11px] relative transition-all",
                isActive
                  ? "text-white font-bold"
                  : "text-white/50 hover:text-white"
              )}
            >
              {isActive && (
                <span className="absolute -top-2 inset-x-3 h-0.5 bg-gradient-to-r from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] rounded-full shadow-[0_0_8px_#2F7BFF]" />
              )}
              <Icon className={cn("h-4 w-4 mb-1", isActive ? "text-[#38BDF8]" : "")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
