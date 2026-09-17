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
  CheckCircle2,
  DollarSign,
  Radio,
  Sparkles,
} from "lucide-react";

export default function MerchantPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [merchantName, setMerchantName] = useState("مطعم شاورما الضيعة");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("masar_merchant_email");
      if (email && email.includes("aldiaa")) {
        setMerchantName("مطعم شاورما الضيعة");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
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
      label: "لوحة الكاشير والاستبدال",
      icon: LayoutDashboard,
      active: pathname === "/merchant/dashboard",
    },
    {
      href: "/merchant/anti-fraud",
      label: "مكافحة الاحتيال (Dynamic QR)",
      icon: ShieldCheck,
      badge: "30s Guard",
      active: pathname === "/merchant/anti-fraud",
    },
    {
      href: "/merchant/settlements",
      label: "مركز التسويات والفواتير",
      icon: DollarSign,
      badge: "نصف شهري",
      active: pathname === "/merchant/settlements",
    },
    {
      href: "/merchant/campus-drops",
      label: "حملات البث للحرم (Drops)",
      icon: Radio,
      badge: "Geo-Push",
      active: pathname === "/merchant/campus-drops",
    },
    {
      href: "/merchant/dashboard?tab=deals",
      label: "مدير العروض",
      icon: Tag,
      active: false,
    },
    {
      href: "/merchant/dashboard?tab=logs",
      label: "سجل العمليات",
      icon: TrendingUp,
      active: false,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans">
      {/* Background Subtle Linear Grids */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Top Global Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d14]/90 backdrop-blur-xl px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Store Identity */}
          <div className="flex items-center gap-3">
            <Link href="/merchant/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-950/40 border border-emerald-400/30">
                ▲
              </div>
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">مسار للشركاء</span>
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Merchant Pro Suite
                  </span>
                </div>
              </div>
            </Link>

            <div className="hidden md:block h-5 w-px bg-white/10 mx-1" />

            {/* Live POS Status */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0f1724] border border-white/10 text-[11px] text-slate-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>نقطة البيع متصلة (POS Live)</span>
            </div>
          </div>

          {/* Center Nav Bar (Pro Suite Modules) */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    item.active
                      ? "bg-white/10 text-white shadow-sm border border-white/15"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Store Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg border border-white/5 hover:bg-white/[0.04] hidden xl:inline-flex items-center gap-1.5"
            >
              <span>بوابة الطلاب</span>
              <ArrowRight className="h-3 w-3 rotate-180 text-emerald-400" />
            </Link>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1724] border border-white/10 text-xs">
              <Store className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                {merchantName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Sub-Ribbon */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pt-2 pb-1 border-t border-white/5 mt-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                  item.active
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white bg-[#0f1724] border border-white/5"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Page Body */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>

      {/* Bottom Legal & Operational Bar */}
      <footer className="relative z-10 border-t border-white/10 bg-[#090d14] px-4 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>نظام نقاط البيع والخصومات الجامعية — منصة مسار Merchant Pro Suite v3.0</span>
          </div>
          <div>جلسة نقطة بيع آمنة وموثقة أكاديمياً • TLS 1.3 Certified</div>
        </div>
      </footer>
    </div>
  );
}
