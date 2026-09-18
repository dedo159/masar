"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, AlertTriangle, Briefcase, BarChart3, LogOut } from "lucide-react";
import { useState } from "react";
import { MasarLogo } from "@/components/ui/logo";

export default function UniversityPortalLayout({
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
      await fetch("/api/university/auth/logout", { method: "POST" });
      router.push("/university/login");
      router.refresh();
    } catch {
      router.push("/university/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    {
      href: "/university/dashboard",
      label: "لوحة البيانات",
      icon: LayoutDashboard,
    },
    {
      href: "/university/analytics",
      label: "التحليلات الشاملة",
      icon: BarChart3,
    },
    {
      href: "/university/at-risk",
      label: "الطلاب المعرضون للخطر",
      icon: AlertTriangle,
    },
    {
      href: "/university/internships",
      label: "فرص التدريب",
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0E22] text-foreground" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0B0C1E]/95 border-l border-white/[0.08] backdrop-blur-2xl shadow-2xl relative z-40">
        <div className="p-5 flex items-center gap-3 border-b border-white/[0.08]">
          <MasarLogo variant="icon" size="sm" priority />
          <div>
            <h1 className="text-sm font-bold masar-gradient-text tracking-tight">مسار الأكاديمي</h1>
            <p className="text-[10px] text-white/50 font-medium">بوابة موظفي ومسؤولي الجامعة</p>
          </div>
        </div>

        <nav className="flex-1 px-3.5 py-4 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#2F7BFF]/25 to-[#E83D84]/15 text-white border border-[#2F7BFF]/40 shadow-[0_0_20px_rgba(47,123,255,0.25)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#38BDF8]" : "text-white/60"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.08]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/25 active:scale-[0.98]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="h-16 bg-[#0B0C1E]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2.5 md:hidden">
            <MasarLogo variant="icon" size="xs" />
            <span className="font-bold masar-gradient-text text-sm">مسار الأكاديمي</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <h2 className="text-xs font-semibold text-white/70">
              مسار الأكاديمي — لوحة إدارة المتابعة والجاهزية الجامعية
            </h2>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="md:hidden px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 rounded-lg hover:bg-rose-500/25"
          >
            خروج
          </button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0C1E]/95 backdrop-blur-2xl border-t border-white/[0.08] flex justify-around p-2 z-40 shadow-2xl">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[11px] relative transition-all ${
                isActive
                  ? "text-white font-bold"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 inset-x-3 h-0.5 bg-gradient-to-r from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] rounded-full shadow-[0_0_8px_#2F7BFF]" />
              )}
              <Icon className={`h-4 w-4 mb-1 ${isActive ? "text-[#38BDF8]" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
