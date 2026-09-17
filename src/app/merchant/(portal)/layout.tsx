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
      href: "/merchant/cashier",
      label: "محطة الكاشير المستقلة",
      icon: ScanLine,
      badge: "POS",
      active: false,
    },
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
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <MasarLogo size="sm" priority />
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-foreground">مسار</span>
            <span className="text-[11px] text-muted-foreground font-medium">بوابة الشركاء والمتاجر</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                  item.active
                    ? "bg-primary/10 text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", item.active ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store & Branch Info Badge at Bottom of Sidebar */}
        <div className="p-3 border-t border-border space-y-2.5">
          <div className="p-2.5 rounded-xl bg-muted/60 border border-border text-xs">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-foreground truncate block text-xs">
                  {merchantName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate block mt-0.5">
                  {currentBranch}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>POS متصل ونشط</span>
              </span>
            </div>
          </div>

          {/* Quick Bottom Actions: Theme Switcher, Student Portal, Logout */}
          <div className="flex items-center justify-between gap-1">
            {/* Theme Toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title={isDark ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
                <span className="text-[11px]">{isDark ? "نهاري" : "ليلي"}</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area — Offset for Sidebar just like the Student Portal */}
      <div className="flex-1 flex flex-col md:pr-60 min-h-screen">
        {/* Top Header Bar — Matching Student Site PageHeader */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md px-4 sm:px-8 py-3 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Mobile Brand / Logo */}
            <div className="flex items-center gap-2.5">
              <div className="md:hidden flex items-center gap-2">
                <MasarLogo size="sm" priority />
                <span className="text-sm font-bold text-foreground">مسار للشركاء</span>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">بوابة الشركاء والمتاجر</span>
                <span>/</span>
                <span>نظام الكاشير ومكافحة الاحتيال والتسويات</span>
              </div>
            </div>

            {/* Top Right Quick Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium">
                <Store className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-foreground">{merchantName}</span>
              </div>

              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                  title={isDark ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
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

      {/* Mobile Bottom Navigation — Matching Student Site BottomNav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden pb-[max(env(safe-area-inset-bottom,0px),6px)] pt-1 px-1 select-none shadow-md">
        <div className="grid grid-cols-4 w-full items-center">
          {[
            { href: "/merchant/dashboard", icon: LayoutDashboard, label: "الكاشير" },
            { href: "/merchant/anti-fraud", icon: ShieldCheck, label: "مكافحة الاحتيال" },
            { href: "/merchant/settlements", icon: DollarSign, label: "التسويات" },
            { href: "/merchant/campus-drops", icon: Radio, label: "حملات الحرم" },
          ].map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-lg py-1 px-0.5 min-w-0 transition-all text-center",
                  isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-md transition-all flex items-center justify-center",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-medium truncate w-full block text-center mt-0.5">
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
