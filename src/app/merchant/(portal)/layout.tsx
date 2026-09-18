"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import {
  Store,
  LayoutDashboard,
  ScanLine,
  Tag,
  TrendingUp,
  LogOut,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Radio,
  Sun,
  Moon,
  Sparkles,
  Settings,
  BarChart3,
} from "lucide-react";
import { useTheme } from "next-themes";
import { MasarLogo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export default function MerchantPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [merchantName, setMerchantName] = useState("مطعم شاورما الضيعة");
  const [currentBranch, setCurrentBranch] = useState("فرع الجامعة الأردنية — مجمّع العلوم والطب");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("masar_merchant_role");
      if (role === "cashier") {
        router.replace("/merchant/cashier");
        return;
      }
      const email = localStorage.getItem("masar_merchant_email");
      if (email && email.includes("aldiaa")) {
        setMerchantName("مطعم شاورما الضيعة");
      }
    }
  }, [router]);

  const isDark = resolvedTheme === "dark";

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("masar_merchant_role");
      }
      await fetch("/api/merchant/auth/logout", { method: "POST" });
      router.push("/merchant/login");
      router.refresh();
    } catch {
      router.push("/merchant/login");
    }
  };

  const navItems = [
    {
      href: "/merchant/dashboard",
      label: "لوحة التحكم والعمليات",
      icon: LayoutDashboard,
      active: pathname === "/merchant/dashboard",
    },
    {
      href: "/merchant/anti-fraud",
      label: "مكافحة الاحتيال (Dynamic QR)",
      icon: ShieldCheck,
      badge: "30s",
      active: pathname === "/merchant/anti-fraud",
    },
    {
      href: "/merchant/settlements",
      label: "مركز التسويات والفواتير",
      icon: DollarSign,
      badge: "PDF",
      active: pathname === "/merchant/settlements",
    },
    {
      href: "/merchant/campus-drops",
      label: "حملات البث للحرم (Drops)",
      icon: Radio,
      badge: "Push",
      active: pathname === "/merchant/campus-drops",
    },
    {
      href: "/merchant/analytics",
      label: "التقارير والإحصائيات الشاملة",
      icon: BarChart3,
      badge: "Live",
      active: pathname === "/merchant/analytics",
    },
    {
      href: "/merchant/settings",
      label: "إعدادات المتجر والحساب",
      icon: Settings,
      active: pathname === "/merchant/settings",
    },
    {
      href: "/merchant/dashboard?tab=deals",
      label: "مدير العروض والخصومات",
      icon: Tag,
      active: false,
    },
    {
      href: "/merchant/dashboard?tab=logs",
      label: "سجل العمليات والتقارير",
      icon: TrendingUp,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row" dir="rtl">
      {/* Desktop Sidebar — Matching Masar Student Site Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-card border-l border-border fixed top-0 bottom-0 right-0 z-40">
        {/* Brand Header with MasarLogo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <MasarLogo variant="icon" size="sm" priority />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight masar-gradient-text">مسار</span>
            <span className="text-[11px] text-muted-foreground font-medium">بوابة الشركاء والمتاجر</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  item.active
                    ? "bg-gradient-to-r from-[#2F7BFF]/25 to-[#E83D84]/15 text-white border border-[#2F7BFF]/40 shadow-[0_0_20px_rgba(47,123,255,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", item.active ? "text-[#38BDF8]" : "text-white/60")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#2F7BFF]/15 text-[#38BDF8] border border-[#2F7BFF]/30 font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store & Branch Info Badge at Bottom of Sidebar */}
        <div className="p-3 border-t border-border space-y-2.5">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-amber-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-white truncate block text-xs">
                  {merchantName}
                </span>
                <span className="text-[10px] text-white/50 truncate block mt-0.5">
                  {currentBranch}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>POS متصل ونشط</span>
              </span>
            </div>
          </div>

          {/* Quick Bottom Actions: Theme Switcher, Logout */}
          <div className="flex items-center justify-between gap-1">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer border border-white/10"
                title={isDark ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-400" />}
                <span className="text-[11px]">{isDark ? "نهاري" : "ليلي"}</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium border border-rose-500/20"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pr-60 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-8 py-3 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Mobile Brand / Logo */}
            <div className="flex items-center gap-2.5">
              <div className="md:hidden flex items-center gap-2">
                <MasarLogo variant="icon" size="xs" priority />
                <span className="text-sm font-bold tracking-tight masar-gradient-text">مسار للشركاء</span>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
                <span className="h-2 w-2 rounded-full bg-[#00D2FF] animate-pulse" />
                <span className="font-semibold text-white">بوابة الشركاء والمتاجر</span>
                <span>/</span>
                <span>إدارة المتجر والعروض والتقارير المالية</span>
              </div>
            </div>

            {/* Top Right Quick Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white">
                <Store className="h-3.5 w-3.5 text-amber-400" />
                <span>{merchantName}</span>
              </div>

              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1.5 text-xs border border-white/10"
                  title={isDark ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-400" />}
                  <span className="hidden sm:inline text-[11px]">{isDark ? "نهاري" : "ليلي"}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.08] bg-[#0B0C1E]/95 backdrop-blur-2xl md:hidden pb-[max(env(safe-area-inset-bottom,0px),6px)] pt-1 px-1 select-none shadow-2xl">
        <div className="grid grid-cols-6 w-full items-center">
          {[
            { href: "/merchant/dashboard", icon: LayoutDashboard, label: "الرئيسية" },
            { href: "/merchant/analytics", icon: BarChart3, label: "التقارير" },
            { href: "/merchant/settlements", icon: DollarSign, label: "التسويات" },
            { href: "/merchant/campus-drops", icon: Radio, label: "الحملات" },
            { href: "/merchant/anti-fraud", icon: ShieldCheck, label: "الاحتيال" },
            { href: "/merchant/settings", icon: Settings, label: "الإعدادات" },
          ].map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 px-0.5 min-w-0 transition-all text-center relative",
                  isActive ? "text-white font-bold" : "text-white/50 hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute -top-1 inset-x-2 h-0.5 bg-gradient-to-r from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] rounded-full shadow-[0_0_8px_#2F7BFF]" />
                )}
                <div
                  className={cn(
                    "p-1 rounded-lg transition-all flex items-center justify-center",
                    isActive ? "text-[#38BDF8]" : ""
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-medium truncate w-full block text-center">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
