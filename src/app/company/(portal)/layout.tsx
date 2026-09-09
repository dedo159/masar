"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, BarChart3, LogOut } from "lucide-react";
import { useState } from "react";

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
    <div className="flex min-h-screen bg-emerald-50/30 dark:bg-slate-950 text-slate-900 dark:text-slate-100" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-l border-emerald-100 dark:border-slate-800 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-50 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/20">
            🏢
          </div>
          <div>
            <h1 className="text-base font-bold text-emerald-700 dark:text-emerald-400">بوابة الشركات</h1>
            <p className="text-[11px] text-muted-foreground">استقطاب الكفاءات الطلابية</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/company/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-50 dark:border-slate-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-colors border border-red-200 dark:border-red-900/50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-emerald-100 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:hidden">
            <span className="text-xl">🏢</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">بوابة الشركات</span>
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              مسار — لوحة مسؤولي التوظيف والتدريب
            </h2>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="md:hidden px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
          >
            خروج
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 z-40 shadow-lg">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/company/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-4 rounded-lg text-[11px] ${
                isActive
                  ? "text-emerald-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
