"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  ScanLine,
  Tag,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  Camera,
  X,
  Plus,
  Clock,
  Users,
  DollarSign,
  Copy,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  Layers,
  FileText,
  Printer,
  ChevronLeft,
  Hash,
  UserCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCameraScanner } from "@/components/merchant/qr-camera-scanner";
import { DynamicRollingQrGuard } from "@/components/merchant/dynamic-rolling-qr-guard";
import { SettlementInvoicingHub } from "@/components/merchant/settlement-invoicing-hub";
import { SponsoredCampusDrops } from "@/components/merchant/sponsored-campus-drops";
import { Radio } from "lucide-react";

// --- Types ---
interface Deal {
  id: string;
  title: string;
  category: string;
  discountType: "percentage" | "bogo" | "freebie" | "fixed";
  discountValue: string;
  usedCount: number;
  totalCap: number;
  maxUsesPerStudent: number; // Max times one student can redeem this deal
  validUntil: string;
  isActive: boolean;
  terms: string;
}

interface RedemptionLog {
  id: string;
  trxId: string;
  studentName: string;
  studentId: string;
  university: string;
  dealTitle: string;
  discountLabel: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  timestamp: string;
  status: "verified" | "flagged";
  usageSequence: string; // e.g. "المرة 1 من 3"
}

export default function MerchantDashboardPage() {
  // Active Tab: "deals" | "logs" | "anti-fraud" | "settlements" | "campus-drops"
  const [activeTab, setActiveTab] = useState<
    "deals" | "logs" | "anti-fraud" | "settlements" | "campus-drops"
  >("deals");

  // Store & Branch Header State
  const [storeName, setStoreName] = useState("مطعم شاورما الضيعة");
  const [currentBranch, setCurrentBranch] = useState("فرع الجامعة الأردنية — مجمّع العلوم والطب");
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // Shift Stats (Today's statistics)
  const [shiftStats, setShiftStats] = useState({
    todayRedemptions: 48,
    shiftSalesVolume: 184.5,
    studentSavingsTotal: 46.2,
    newStudentCustomers: 19,
  });

  // --- Tab 2: Deals Management State with Usage Caps ---
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "deal-1",
      title: "خصم 20% على جميع وجبات الشاورما العائلية والسوبر",
      category: "وجبات",
      discountType: "percentage",
      discountValue: "20%",
      usedCount: 142,
      totalCap: 300,
      maxUsesPerStudent: 3, // Allowed 3 times per student
      validUntil: "2026-11-30",
      isActive: true,
      terms: "يسري العرض عند إبراز الهوية الجامعية. بحد أقصى 3 مرات لكل طالب.",
    },
    {
      id: "deal-2",
      title: "وجبة شاورما دبل مجانية عند شراء وجبتين سوبر (BOGO)",
      category: "وجبات",
      discountType: "bogo",
      discountValue: "اشترِ 2 واحصل على 1 مجاناً",
      usedCount: 89,
      totalCap: 150,
      maxUsesPerStudent: 2, // Allowed 2 times per student
      validUntil: "2026-10-15",
      isActive: true,
      terms: "ساري طيلة أيام الأسبوع من 12:00 ظهراً حتى 6:00 م. مرتان لكل طالب كحد أقصى.",
    },
    {
      id: "deal-3",
      title: "مشروب غازي + بطاطا مجانية مع أي ساندويش فردي",
      category: "مشروبات",
      discountType: "freebie",
      discountValue: "هدية مجانية",
      usedCount: 215,
      totalCap: 400,
      maxUsesPerStudent: 5, // Allowed 5 times per student
      validUntil: "2026-12-31",
      isActive: true,
      terms: "متاح لجميع طلبة الجامعات المسجلين بنظام مسار. بحد أقصى 5 استخدامات لكل طالب.",
    },
    {
      id: "deal-4",
      title: "خصم بقيمة 2.50 د.أ على طلبات الغداء الجماعية (+15 د.أ)",
      category: "وجبات",
      discountType: "fixed",
      discountValue: "2.50 د.أ",
      usedCount: 34,
      totalCap: 100,
      maxUsesPerStudent: 1, // Single use per student
      validUntil: "2026-09-30",
      isActive: false,
      terms: "للطلبات الميدانية داخل الصالة فقط. مسموح مرة واحدة فقط لكل طالب.",
    },
  ]);

  const [dealFilter, setDealFilter] = useState("الكل");
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [newDealForm, setNewDealForm] = useState({
    title: "",
    category: "وجبات",
    discountType: "percentage" as const,
    discountValue: "20%",
    totalCap: 200,
    maxUsesPerStudent: 2,
    validUntil: "2026-12-31",
    terms: "يسري العرض بإبراز تطبيق مسار للطلاب.",
  });

  // --- Tab 3: Redemption Logs State ---
  const [logs, setLogs] = useState<RedemptionLog[]>([
    {
      id: "log-1",
      trxId: "#TRX-8942",
      studentName: "عمر خالد السعيد",
      studentId: "202310890",
      university: "جامعة عمان الأهلية",
      dealTitle: "خصم 20% على وجبة الشاورما العائلية",
      discountLabel: "خصم 20%",
      originalPrice: 10.0,
      discountAmount: 2.0,
      finalPrice: 8.0,
      timestamp: "منذ 4 دقائق (02:41 م)",
      status: "verified",
      usageSequence: "المرة 1 من 3",
    },
    {
      id: "log-2",
      trxId: "#TRX-8941",
      studentName: "سارة أحمد النجار",
      studentId: "202210452",
      university: "الجامعة الأردنية",
      dealTitle: "مشروب غازي + بطاطا مجانية مع الساندويش",
      discountLabel: "هدية مجانية",
      originalPrice: 4.5,
      discountAmount: 1.5,
      finalPrice: 3.0,
      timestamp: "منذ 18 دقيقة (02:27 م)",
      status: "verified",
      usageSequence: "المرة 2 من 5",
    },
    {
      id: "log-3",
      trxId: "#TRX-8940",
      studentName: "زيد محمود القضاة",
      studentId: "202410199",
      university: "جامعة العلوم والتكنولوجيا",
      dealTitle: "وجبة شاورما دبل مجانية (BOGO)",
      discountLabel: "اشترِ 2 واحصل على 1",
      originalPrice: 7.0,
      discountAmount: 2.5,
      finalPrice: 4.5,
      timestamp: "منذ 35 دقيقة (02:10 م)",
      status: "verified",
      usageSequence: "المرة 1 من 2",
    },
    {
      id: "log-4",
      trxId: "#TRX-8939",
      studentName: "رنيم مصطفى عواد",
      studentId: "202310211",
      university: "الجامعة الأردنية",
      dealTitle: "خصم 20% على وجبة الشاورما العائلية",
      discountLabel: "خصم 20%",
      originalPrice: 12.0,
      discountAmount: 2.4,
      finalPrice: 9.6,
      timestamp: "منذ ساعة (01:45 م)",
      status: "verified",
      usageSequence: "المرة 1 من 3",
    },
    {
      id: "log-5",
      trxId: "#TRX-8938",
      studentName: "محمد طارق عثمان",
      studentId: "202110992",
      university: "جامعة البلقاء التطبيقية",
      dealTitle: "مشروب غازي + بطاطا مجانية مع الساندويش",
      discountLabel: "هدية مجانية",
      originalPrice: 3.8,
      discountAmount: 1.2,
      finalPrice: 2.6,
      timestamp: "منذ ساعتين (12:50 م)",
      status: "verified",
      usageSequence: "المرة 3 من 5",
    },
  ]);

  const [logSearchQuery, setLogSearchQuery] = useState("");

  // Auto handle URL query param ?tab=
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab");
      if (tab === "deals") setActiveTab("deals");
      if (tab === "logs") setActiveTab("logs");
    }
  }, []);

  // --- Handlers: Tab 2 Deals ---
  const handleToggleDealStatus = (id: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const handleDeleteDeal = (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في إيقاف وحذف هذا العرض نهائياً؟")) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealForm.title) return;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: newDealForm.title,
      category: newDealForm.category,
      discountType: newDealForm.discountType,
      discountValue: newDealForm.discountValue,
      usedCount: 0,
      totalCap: Number(newDealForm.totalCap) || 200,
      maxUsesPerStudent: Number(newDealForm.maxUsesPerStudent) || 1,
      validUntil: newDealForm.validUntil,
      isActive: true,
      terms: `${newDealForm.terms} (الحد الأقصى: ${newDealForm.maxUsesPerStudent} مرات لكل طالب).`,
    };

    setDeals([newDeal, ...deals]);
    setIsNewDealModalOpen(false);
    setNewDealForm({
      title: "",
      category: "وجبات",
      discountType: "percentage",
      discountValue: "20%",
      totalCap: 200,
      maxUsesPerStudent: 2,
      validUntil: "2026-12-31",
      terms: "يسري العرض بإبراز تطبيق مسار للطلاب.",
    });
  };

  const filteredDeals =
    dealFilter === "الكل" ? deals : deals.filter((d) => d.category === dealFilter);

  const filteredLogs = logs.filter(
    (l) =>
      l.studentName.includes(logSearchQuery) ||
      l.studentId.includes(logSearchQuery) ||
      l.trxId.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Merchant Header & Branch Selector */}
      <div className="relative z-30 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Store Info & Live POS Indicator */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-2xl shadow-inner shrink-0">
              🍔
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{storeName}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>متصل بنقطة البيع · POS Active</span>
                </span>
              </div>

              {/* Branch Selector with Safe Backdrop Popover */}
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-medium cursor-pointer py-0.5 px-1.5 -mx-1.5 rounded-md hover:bg-muted"
                >
                  <span className="font-semibold text-foreground/90">{currentBranch}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isBranchDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isBranchDropdownOpen && (
                  <>
                    {/* Invisible full-screen backdrop to dismiss popover when tapping outside */}
                    <div
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
                      onClick={() => setIsBranchDropdownOpen(false)}
                    />

                    {/* Floating Popover Menu */}
                    <div className="absolute top-full right-0 mt-2 z-50 w-full sm:w-80 rounded-xl border border-border bg-card p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground border-b border-border flex items-center justify-between mb-1">
                        <span>اختر الفرع المتصل:</span>
                        <button
                          type="button"
                          onClick={() => setIsBranchDropdownOpen(false)}
                          className="text-muted-foreground hover:text-foreground p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                      {[
                        "فرع الجامعة الأردنية — مجمّع العلوم والطب",
                        "فرع جامعة عمان الأهلية — البوابة الرئيسية",
                        "فرع جامعة العلوم والتكنولوجيا — المجمّع التجاري",
                      ].map((branch) => (
                        <button
                          key={branch}
                          type="button"
                          onClick={() => {
                            setCurrentBranch(branch);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            currentBranch === branch
                              ? "bg-primary/10 text-primary font-bold border border-primary/20"
                              : "text-foreground/80 hover:bg-muted"
                          }`}
                        >
                          <span>{branch}</span>
                          {currentBranch === branch && <span className="text-primary text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 2. مؤشرات وأداء المتجر والمبيعات الميدانية (Store Performance Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>استبدالات اليوم</span>
            <ScanLine className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {shiftStats.todayRedemptions} <span className="text-xs text-muted-foreground font-sans">عملية</span>
          </p>
          <p className="text-[11px] text-emerald-400 font-mono">+12 عملية عن نفس التوقيت أمس</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>مبيعات الطلاب الميدانية</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {shiftStats.shiftSalesVolume.toFixed(2)} <span className="text-xs text-muted-foreground font-sans">د.أ</span>
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">عبر بوابة الدفع والخصومات المعتمدة</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>إجمالي التوفير للطلبة</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {shiftStats.studentSavingsTotal.toFixed(2)} <span className="text-xs text-muted-foreground font-sans">د.أ</span>
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">حافز زيارة ومبيعات إضافية</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>الزبائن الجدد من الطلاب</span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {shiftStats.newStudentCustomers} <span className="text-xs text-muted-foreground font-sans">طالب</span>
          </p>
          <p className="text-[11px] text-purple-400 font-mono">أول تجربة شراء عبر مسار</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* التبويب 2: مدير العروض والخصومات (Deal Management & Builder) */}
      {/* ========================================================================= */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          {/* Deals Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground ml-2">تصنيف العروض:</span>
              {["الكل", "وجبات", "مشروبات", "خدمات"].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setDealFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    dealFilter === category
                      ? "bg-emerald-600 text-white"
                      : "bg-background text-muted-foreground hover:text-white border border-border/60"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Prominent Floating Add Deal Button */}
            <Button
              onClick={() => setIsNewDealModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>إنشاء عرض جديد وتحديد سقفه</span>
            </Button>
          </div>

          {/* Deals Grid with Usage Caps & Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDeals.map((deal) => {
              const usagePercent = Math.min(100, Math.round((deal.usedCount / deal.totalCap) * 100));
              return (
                <div
                  key={deal.id}
                  className="p-6 rounded-2xl border border-border bg-card shadow-xl hover:border-border transition-all flex flex-col justify-between space-y-4 text-start"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px]">
                        {deal.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Max per student badge */}
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono flex items-center gap-1">
                          <Lock className="h-3 w-3 text-purple-400" />
                          <span>
                            {deal.maxUsesPerStudent >= 99
                              ? "غير محدود للطالب"
                              : `الحد: ${deal.maxUsesPerStudent} مرات/طالب`}
                          </span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            deal.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-muted-foreground border border-border/60"
                          }`}
                        >
                          {deal.isActive ? "نشط · Active" : "متوقف مؤقتاً"}
                        </span>
                        <span className="text-sm font-extrabold text-white font-mono bg-white/5 px-2 py-0.5 rounded-lg">
                          {deal.discountValue}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{deal.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{deal.terms}</p>
                  </div>

                  {/* Usage Cap Progress Bar */}
                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">سقف استهلاك الكوبونات الإجمالي:</span>
                      <span className="text-white font-semibold">
                        {deal.usedCount} من أصل {deal.totalCap} كوبون ({usagePercent}%)
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-background overflow-hidden border border-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 font-mono">
                      <span>صالح لغاية: {deal.validUntil}</span>
                      <span>متبقي: {deal.totalCap - deal.usedCount} كوبون</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => handleToggleDealStatus(deal.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        deal.isActive
                          ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      {deal.isActive ? "إيقاف مؤقت" : "إعادة التفعيل"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDeal(deal.id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* التبويب 3: سجل العمليات والتحليلات (Redemption Logs & Analytics) */}
      {/* ========================================================================= */}
      {activeTab === "logs" && (
        <div className="space-y-6">
          {/* Commercial KPIs Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>إجمالي مبيعات طلبة مسار</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                2,480.00 <span className="text-xs text-muted-foreground font-sans">د.أ</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">+24% نمو هذا الشهر</p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>ساعة الذروة الطلابية</span>
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">01:00 م - 03:30 م</p>
              <p className="text-[11px] text-muted-foreground font-mono">بين المحاضرات وفترات الغداء</p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>معدل عودة الطلاب (Retention)</span>
                <RotateCcw className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-amber-400">68%</p>
              <p className="text-[11px] text-muted-foreground font-mono">يعودون للشراء خلال 14 يوماً</p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>متوسط التوفير لكل فاتورة</span>
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                2.15 <span className="text-xs text-muted-foreground font-sans">د.أ</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">معدل خصم مثالي يحقق الربحية</p>
            </div>
          </div>

          {/* Granular Logs Table with Usage Sequence */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">سجل استبدالات الكوبونات المباشر</h3>
                <p className="text-xs text-muted-foreground">
                  رصد دقيق لكافة العمليات بالدقائق وعدد مرات استخدام كل طالب لمنع الاحتيال وضبط المحاسبة.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث باسم الطالب أو رقم #TRX..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full h-10 pr-9 pl-4 text-xs font-mono rounded-xl border border-border bg-background text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono">
                    <th className="py-3 px-4">رقم العملية</th>
                    <th className="py-3 px-4">التوقيت الدقيق</th>
                    <th className="py-3 px-4">الطالب والجامعة</th>
                    <th className="py-3 px-4">الخصم المطبق</th>
                    <th className="py-3 px-4">حصة الاستخدام</th>
                    <th className="py-3 px-4">الفاتورة / التوفير</th>
                    <th className="py-3 px-4 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {log.trxId}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground font-mono">{log.timestamp}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{log.studentName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {log.studentId} • {log.university}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[11px]">
                          {log.discountLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px]">
                          {log.usageSequence}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-white font-bold">{log.finalPrice.toFixed(2)} د.أ</div>
                        <div className="text-[11px] text-emerald-400">
                          وفر: {log.discountAmount.toFixed(2)} د.أ
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>معتمد</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      

      {/* ========================================================================= */}
      {/* Deal Builder Modal (إنشاء عرض جديد مع تحديد سقف مرات الاستخدام) */}
      {/* ========================================================================= */}
      {isNewDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-start">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">إضافة عرض وترويج طلابي جديد</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDealModalOpen(false)}
                className="text-muted-foreground hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3.5 text-xs">
              <div>
                <label className="text-foreground/80 font-semibold mb-1 block">عنوان العرض</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: خصم 25% على كافة وجبات الغداء"
                  value={newDealForm.title}
                  onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground/80 font-semibold mb-1 block">التصنيف</label>
                  <select
                    value={newDealForm.category}
                    onChange={(e) => setNewDealForm({ ...newDealForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="وجبات">🍔 وجبات ومطاعم</option>
                    <option value="مشروبات">☕ مقاهي ومشروبات</option>
                    <option value="مكتبات">📚 قرطاسية ومكتبات</option>
                    <option value="خدمات">💻 خدمات وتقنية</option>
                  </select>
                </div>

                <div>
                  <label className="text-foreground/80 font-semibold mb-1 block">نوع الخصم</label>
                  <select
                    value={newDealForm.discountType}
                    onChange={(e) =>
                      setNewDealForm({
                        ...newDealForm,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">نسبة مئوية (Percentage)</option>
                    <option value="bogo">BOGO (اشتري 1 واحصل على 1)</option>
                    <option value="freebie">هدية / إضافات مجانية</option>
                    <option value="fixed">مبلغ مالي ثابت (Fixed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground/80 font-semibold mb-1 block">قيمة الخصم المعلنة</label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: 20% أو بطاطا مجانية"
                    value={newDealForm.discountValue}
                    onChange={(e) => setNewDealForm({ ...newDealForm, discountValue: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-foreground/80 font-semibold mb-1 block">سقف الكوبونات الإجمالي (Total Cap)</label>
                  <input
                    required
                    type="number"
                    min={10}
                    placeholder="مثال: 300"
                    value={newDealForm.totalCap}
                    onChange={(e) => setNewDealForm({ ...newDealForm, totalCap: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Explicit Field: Max Uses Per Student */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground/80 font-semibold mb-1 block flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-purple-400" />
                    <span>الحد الأقصى لكل طالب (Usage Limit)</span>
                  </label>
                  <select
                    value={newDealForm.maxUsesPerStudent}
                    onChange={(e) =>
                      setNewDealForm({
                        ...newDealForm,
                        maxUsesPerStudent: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value={1}>مرة واحدة فقط (1x - الأكثر أماناً)</option>
                    <option value={2}>مرتان لكل طالب (2x)</option>
                    <option value={3}>3 مرات لكل طالب (3x)</option>
                    <option value={5}>5 مرات لكل طالب (5x)</option>
                    <option value={999}>غير محدود (Unlimited)</option>
                  </select>
                </div>

                <div>
                  <label className="text-foreground/80 font-semibold mb-1 block">تاريخ الانتهاء</label>
                  <input
                    required
                    type="date"
                    value={newDealForm.validUntil}
                    onChange={(e) => setNewDealForm({ ...newDealForm, validUntil: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-foreground/80 font-semibold mb-1 block">الشروط والأحكام</label>
                <textarea
                  rows={2}
                  value={newDealForm.terms}
                  onChange={(e) => setNewDealForm({ ...newDealForm, terms: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-background text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="border-border text-white hover:bg-white/10 h-10 text-xs cursor-pointer"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 text-xs px-5 rounded-xl cursor-pointer"
                >
                  نشر العرض وتفعيله فورياً
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
