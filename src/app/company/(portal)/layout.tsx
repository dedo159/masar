"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, BarChart3, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { MasarLogo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export default function CompanyPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <MasarLogo size="sm" priority />
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-foreground">مسار</span>
            <span className="text-[11px] text-muted-foreground font-medium">بوابة الشركات والتوظيف</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pr-60 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:hidden">
            <MasarLogo size="xs" />
            <span className="font-bold text-foreground text-sm">بوابة الشركات</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              مسار للأعمال
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              · منصة إدارة واستقطاب المواهب التقنية
            </span>
          </div>

          <div className="flex items-center gap-3">
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

      {/* Mobile Bottom Navigation — Matching Masar App BottomNav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border flex justify-around p-1.5 z-40 shadow-lg">
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
                "flex flex-col items-center py-1.5 px-3 rounded-lg text-[11px] transition-all",
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
