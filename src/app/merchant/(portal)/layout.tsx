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
  Menu,
  X,
  Bell,
  Sparkles,
} from "lucide-react";

export default function MerchantPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      label: "لوحة التحكم والكاشير",
      icon: LayoutDashboard,
      badge: "POS Live",
    },
    {
      href: "/merchant/dashboard?tab=deals",
      label: "إدارة العروض والخصومات",
      icon: Tag,
    },
    {
      href: "/merchant/dashboard?tab=logs",
      label: "سجل العمليات والتقارير",
      icon: TrendingUp,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans">
      {/* Background Subtle Linear Grids */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Top Global Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d14]/90 backdrop-blur-xl px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
                    Merchant Portal
                  </span>
                </div>
              </div>
            </Link>

            {/* Separator */}
            <div className="hidden sm:block h-5 w-px bg-white/10 mx-1" />

            {/* Live POS Terminal Status */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0f1724] border border-white/10 text-[11px] text-slate-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>نقطة البيع متصلة (POS Live)</span>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct return to student portal */}
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg border border-white/5 hover:bg-white/[0.04] hidden sm:inline-flex items-center gap-1.5"
            >
              <span>بوابة الطلاب</span>
              <ArrowRight className="h-3 w-3 rotate-180 text-emerald-400" />
            </Link>

            {/* Store Name Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f1724] border border-white/10 text-xs">
              <Store className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">
                {merchantName}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="تسجيل الخروج من بوابة الشركاء"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
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
            <span>نظام نقاط البيع والخصومات الجامعية — منصة مسار v2.6.4</span>
          </div>
          <div>جلسة نقطة بيع آمنة وموثقة أكاديمياً • TLS 1.3 Certified</div>
        </div>
      </footer>
    </div>
  );
}
