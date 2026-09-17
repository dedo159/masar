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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Types ---
interface Deal {
  id: string;
  title: string;
  category: string;
  discountType: "percentage" | "bogo" | "freebie" | "fixed";
  discountValue: string;
  usedCount: number;
  totalCap: number;
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
}

export default function MerchantDashboardPage() {
  // Active Tab: "redemption" | "deals" | "logs"
  const [activeTab, setActiveTab] = useState<"redemption" | "deals" | "logs">("redemption");

  // Store & Branch Header State
  const [storeName, setStoreName] = useState("مطعم شاورما الضيعة");
  const [currentBranch, setCurrentBranch] = useState("فرع الجامعة الأردنية — مجمّع العلوم والطب");
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // --- Tab 1: Instant Redemption Tool State ---
  const [voucherCode, setVoucherCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: "idle" | "success" | "error";
    studentName?: string;
    studentId?: string;
    university?: string;
    major?: string;
    dealTitle?: string;
    originalPrice?: number;
    discountAmount?: number;
    finalPrice?: number;
    trxId?: string;
    errorMessage?: string;
  }>({ status: "idle" });

  const [scannerOpen, setScannerOpen] = useState(false);
  const [copiedTrx, setCopiedTrx] = useState(false);

  // Shift Stats (Today's statistics)
  const [shiftStats, setShiftStats] = useState({
    todayRedemptions: 48,
    shiftSalesVolume: 184.5,
    studentSavingsTotal: 46.2,
    newStudentCustomers: 19,
  });

  // --- Tab 2: Deals Management State ---
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "deal-1",
      title: "خصم 20% على جميع وجبات الشاورما العائلية والسوبر",
      category: "وجبات",
      discountType: "percentage",
      discountValue: "20%",
      usedCount: 142,
      totalCap: 300,
      validUntil: "2026-11-30",
      isActive: true,
      terms: "يسري العرض عند إبراز الهوية الجامعية. غير قابل للدمج مع عروض أخرى.",
    },
    {
      id: "deal-2",
      title: "وجبة شاورما دبل مجانية عند شراء وجبتين سوبر (BOGO)",
      category: "وجبات",
      discountType: "bogo",
      discountValue: "اشترِ 2 واحصل على 1 مجاناً",
      usedCount: 89,
      totalCap: 150,
      validUntil: "2026-10-15",
      isActive: true,
      terms: "ساري طيلة أيام الأسبوع من الساعة 12:00 ظهراً حتى 6:00 مساءً.",
    },
    {
      id: "deal-3",
      title: "مشروب غازي + بطاطا مجانية مع أي ساندويش فردي",
      category: "مشروبات",
      discountType: "freebie",
      discountValue: "هدية مجانية",
      usedCount: 215,
      totalCap: 400,
      validUntil: "2026-12-31",
      isActive: true,
      terms: "متاح لجميع طلبة الجامعات المسجلين بنظام مسار.",
    },
    {
      id: "deal-4",
      title: "خصم بقيمة 2.50 د.أ على طلبات الغداء الجماعية (+15 د.أ)",
      category: "وجبات",
      discountType: "fixed",
      discountValue: "2.50 د.أ",
      usedCount: 34,
      totalCap: 100,
      validUntil: "2026-09-30",
      isActive: false,
      terms: "للطلبات الميدانية داخل الصالة فقط.",
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

  // --- Handlers: Tab 1 Redemption ---
  const handleVerifyCode = (codeToVerify?: string) => {
    const code = (codeToVerify || voucherCode).trim().toUpperCase();
    if (!code) return;

    setIsVerifying(true);
    setVerificationResult({ status: "idle" });

    setTimeout(() => {
      setIsVerifying(false);

      if (code === "EXPIRED99") {
        setVerificationResult({
          status: "error",
          errorMessage: "عذراً، هذا الكوبون منتهي الصلاحية بتاريخ 15 سبتمبر 2026 وغير صالح للاستخدام.",
        });
        return;
      }

      if (code === "USED44") {
        setVerificationResult({
          status: "error",
          errorMessage: "تم استبدال هذا الكوبون مسبقاً اليوم في تمام الساعة 12:45 م بنفس الفرع (#TRX-8102).",
        });
        return;
      }

      if (code === "INVALID" || code.length < 4) {
        setVerificationResult({
          status: "error",
          errorMessage: "رمز القسيمة غير صحيح أو أن حساب الطالب غير مسجل بنظام الاعتماد الجامعي النشط.",
        });
        return;
      }

      // Default or success code (e.g. MASAR20, BURGER50, FREECOFFEE, or any 6 digits)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTrx = `#TRX-${randomNum}`;
      const isFreebie = code.includes("COFFEE") || code.includes("FREE");
      const isBogo = code.includes("BOGO") || code.includes("50");

      let discountText = "خصم 20% على الوجبات الرئيسية";
      let orig = 10.0;
      let disc = 2.0;

      if (isFreebie) {
        discountText = "مشروب وبطاطا مجانية مع الساندويش";
        orig = 4.5;
        disc = 1.5;
      } else if (isBogo) {
        discountText = "خصم 50% على الوجبة الثانية (BOGO)";
        orig = 8.0;
        disc = 4.0;
      }

      const result = {
        status: "success" as const,
        studentName: "عمر خالد السعيد",
        studentId: "202310890",
        university: "جامعة عمان الأهلية",
        major: "هندسة البرمجيات • السنة الثالثة",
        dealTitle: discountText,
        originalPrice: orig,
        discountAmount: disc,
        finalPrice: Number((orig - disc).toFixed(2)),
        trxId: newTrx,
      };

      setVerificationResult(result);

      // Update shift stats
      setShiftStats((prev) => ({
        todayRedemptions: prev.todayRedemptions + 1,
        shiftSalesVolume: Number((prev.shiftSalesVolume + result.finalPrice).toFixed(2)),
        studentSavingsTotal: Number((prev.studentSavingsTotal + result.discountAmount).toFixed(2)),
        newStudentCustomers: prev.newStudentCustomers + 1,
      }));

      // Add to logs
      const newLog: RedemptionLog = {
        id: `log-${Date.now()}`,
        trxId: newTrx,
        studentName: result.studentName,
        studentId: result.studentId,
        university: result.university,
        dealTitle: result.dealTitle,
        discountLabel: isFreebie ? "هدية مجانية" : isBogo ? "خصم 50%" : "خصم 20%",
        originalPrice: result.originalPrice,
        discountAmount: result.discountAmount,
        finalPrice: result.finalPrice,
        timestamp: "الآن (لحظي)",
        status: "verified",
      };

      setLogs((prev) => [newLog, ...prev]);
    }, 450);
  };

  const handleCopyTrx = () => {
    if (verificationResult.trxId) {
      navigator.clipboard?.writeText(verificationResult.trxId);
      setCopiedTrx(true);
      setTimeout(() => setCopiedTrx(false), 1500);
    }
  };

  const handleResetCashier = () => {
    setVoucherCode("");
    setVerificationResult({ status: "idle" });
  };

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
      validUntil: newDealForm.validUntil,
      isActive: true,
      terms: newDealForm.terms,
    };

    setDeals([newDeal, ...deals]);
    setIsNewDealModalOpen(false);
    setNewDealForm({
      title: "",
      category: "وجبات",
      discountType: "percentage",
      discountValue: "20%",
      totalCap: 200,
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
      {/* 1. Fixed / Sticky Top Merchant Header */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1724] p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Store Info & Live POS Indicator */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-transparent border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🍔
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">{storeName}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>متصل بنقطة البيع · POS Active</span>
                </span>
              </div>

              {/* Branch selector / status */}
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>{currentBranch}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {isBranchDropdownOpen && (
                  <div className="absolute top-6 right-0 z-30 w-72 rounded-xl border border-white/10 bg-[#090d14] p-1.5 shadow-2xl space-y-1">
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
                        className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors ${
                          currentBranch === branch
                            ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3 Core Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090d14] border border-white/10 self-start lg:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("redemption")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "redemption"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ScanLine className="h-4 w-4" />
              <span>أداة الاستبدال السريع</span>
              <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px] font-mono">
                ⚡ POS
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "deals"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>مدير العروض ({deals.filter((d) => d.isActive).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "logs"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>سجل العمليات والتحليلات</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* التبويب 1: أداة التحقق الفوري والاستبدال (Instant Redemption Tool) */}
      {/* ========================================================================= */}
      {activeTab === "redemption" && (
        <div className="space-y-6">
          {/* Cashier Main Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1724] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header Title & Mode Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                  <ScanLine className="h-3.5 w-3.5" />
                  <span>محطة الكاشير ونقاط البيع الفورية · Fast POS Terminal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  التحقق من كوبون الطالب واعتماده
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  أدخل رمز الخصم (6 خانات) أو امسح الرمز الشريطي للطالب لتطبيق التوفير وإصدار الإيصال المعتمد.
                </p>
              </div>

              {/* 1. Voucher Input (Large Typography & Mono) */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="MASAR20 أو رمز الخصم"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleVerifyCode();
                      }
                    }}
                    className="w-full h-18 sm:h-20 text-2xl sm:text-3xl font-mono font-bold text-center tracking-[0.2em] rounded-2xl border-2 border-emerald-500/30 bg-[#090d14] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner uppercase"
                  />
                  {voucherCode && (
                    <button
                      type="button"
                      onClick={() => setVoucherCode("")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Quick Test Codes Pills */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">أكواد تجريبية سريعة:</span>
                  {[
                    { label: "MASAR20 (خصم 20%)", code: "MASAR20" },
                    { label: "BURGER50 (خصم 50%)", code: "BURGER50" },
                    { label: "FREECOFFEE (مشروب مجاني)", code: "FREECOFFEE" },
                    { label: "EXPIRED99 (منتهي)", code: "EXPIRED99" },
                    { label: "USED44 (مستخدم)", code: "USED44" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setVoucherCode(item.code);
                        handleVerifyCode(item.code);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Verify Now & QR Scanner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => handleVerifyCode()}
                  disabled={isVerifying || !voucherCode.trim()}
                  className="h-13 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <span className="animate-spin text-white">⏳</span>
                      <span>جاري الفحص بالجامعة...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>تحقق واستبدل الكوبون الآن</span>
                      <span className="text-[11px] font-mono opacity-75">↵</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setScannerOpen(true)}
                  className="h-13 border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <QrCode className="h-5 w-5 text-amber-400" />
                  <span>مسح الـ QR Code الخاص بالطالب</span>
                </Button>
              </div>

              {/* 3. Real-time Feedback Card */}
              {verificationResult.status === "success" && (
                <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/[0.12] via-[#090d14] to-[#090d14] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-start space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">
                            تمت عملية الاستبدال بنجاح!
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-bold text-[10px]">
                            معتمد ✓
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          تم قيد العملية في سجل المتجر وإشعار الطالب فورياً عبر تطبيقه.
                        </p>
                      </div>
                    </div>

                    {/* Transaction Reference ID */}
                    <div className="flex items-center gap-2 bg-[#090d14] px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs text-slate-300">
                      <span>{verificationResult.trxId}</span>
                      <button
                        type="button"
                        onClick={handleCopyTrx}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="نسخ رقم العملية"
                      >
                        {copiedTrx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Student & Deal Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-slate-500">بيانات الطالب المستفيد:</span>
                      <p className="text-sm font-bold text-white">{verificationResult.studentName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">
                        رقم جامعي: {verificationResult.studentId}
                      </p>
                      <p className="text-emerald-400 text-[11px]">{verificationResult.university}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-slate-500">تفاصيل الخصم المطبق:</span>
                      <p className="text-sm font-bold text-amber-400">{verificationResult.dealTitle}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5 mt-1 font-mono">
                        <span className="text-slate-400">قيمة الفاتورة الأصلية:</span>
                        <span className="text-slate-300 line-through">
                          {verificationResult.originalPrice?.toFixed(2)} د.أ
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                        <span>المبلغ الموفر للطالب:</span>
                        <span>- {verificationResult.discountAmount?.toFixed(2)} د.أ</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-white font-extrabold pt-1 border-t border-white/5">
                        <span>المبلغ المستحق للدفع:</span>
                        <span className="text-base text-emerald-400">
                          {verificationResult.finalPrice?.toFixed(2)} د.أ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reset Cashier Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>محمية ضد التكرار برقم مرجعي فريد</span>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleResetCashier}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs h-9 px-4 rounded-lg cursor-pointer"
                    >
                      استبدال كوبون تالي (Shift + N)
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Feedback Card */}
              {verificationResult.status === "error" && (
                <div className="rounded-2xl border-2 border-rose-500/50 bg-rose-500/[0.08] p-5 shadow-2xl animate-in zoom-in-95 duration-200 text-start space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-rose-400">
                        فشل الاستبدال — الكوبون غير مقبول
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {verificationResult.errorMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResetCashier}
                      className="text-xs border-white/10 hover:bg-white/10 text-white h-8"
                    >
                      إعادة المحاولة
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Shift Summary Strip (إحصائيات الوردية الحالية) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>استبدالات الوردية اليوم</span>
                <ScanLine className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                {shiftStats.todayRedemptions} <span className="text-xs text-slate-400 font-sans">عملية</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">+12 عملية عن نفس التوقيت أمس</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>مبيعات الطلاب الميدانية</span>
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                {shiftStats.shiftSalesVolume.toFixed(2)} <span className="text-xs text-slate-400 font-sans">د.أ</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">عبر بوابة الدفع السريع والخصومات</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>إجمالي التوفير للطلبة</span>
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                {shiftStats.studentSavingsTotal.toFixed(2)} <span className="text-xs text-slate-400 font-sans">د.أ</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">حافز زيارة ومبيعات إضافية</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الزبائن الجدد من الطلاب</span>
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                {shiftStats.newStudentCustomers} <span className="text-xs text-slate-400 font-sans">طالب</span>
              </p>
              <p className="text-[11px] text-purple-400 font-mono">أول تجربة شراء عبر مسار</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* التبويب 2: مدير العروض والخصومات (Deal Management & Builder) */}
      {/* ========================================================================= */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          {/* Deals Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0f1724]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 ml-2">تصنيف العروض:</span>
              {["الكل", "وجبات", "مشروبات", "خدمات"].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setDealFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    dealFilter === category
                      ? "bg-emerald-600 text-white"
                      : "bg-[#090d14] text-slate-400 hover:text-white border border-white/5"
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
              <span>إنشاء عرض جديد للفرع</span>
            </Button>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDeals.map((deal) => {
              const usagePercent = Math.min(100, Math.round((deal.usedCount / deal.totalCap) * 100));
              return (
                <div
                  key={deal.id}
                  className="p-6 rounded-2xl border border-white/10 bg-[#0f1724] shadow-xl hover:border-white/20 transition-all flex flex-col justify-between space-y-4 text-start"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px]">
                        {deal.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            deal.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border border-white/5"
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
                    <p className="text-xs text-slate-400 leading-relaxed">{deal.terms}</p>
                  </div>

                  {/* Usage Cap Progress Bar */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">سقف استهلاك الكوبونات:</span>
                      <span className="text-white font-semibold">
                        {deal.usedCount} من أصل {deal.totalCap} كوبون ({usagePercent}%)
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-[#090d14] overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                      <span>صالح لغاية: {deal.validUntil}</span>
                      <span>متبقي: {deal.totalCap - deal.usedCount} كوبون</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
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
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>إجمالي مبيعات طلبة مسار</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                2,480.00 <span className="text-xs text-slate-400 font-sans">د.أ</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">+24% نمو هذا الشهر</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>ساعة الذروة الطلابية</span>
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">01:00 م - 03:30 م</p>
              <p className="text-[11px] text-slate-400 font-mono">بين المحاضرات وفترات الغداء</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>معدل عودة الطلاب (Retention)</span>
                <RotateCcw className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-amber-400">68%</p>
              <p className="text-[11px] text-slate-400 font-mono">يعودون للشراء خلال 14 يوماً</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0f1724] space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>متوسط التوفير لكل فاتورة</span>
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                2.15 <span className="text-xs text-slate-400 font-sans">د.أ</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">معدل خصم مثالي يحقق الربحية</p>
            </div>
          </div>

          {/* Granular Logs Table */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1724] p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">سجل استبدالات الكوبونات المباشر</h3>
                <p className="text-xs text-slate-400">
                  رصد دقيق لكافة العمليات بالدقائق لمنع الاحتيال وضبط المحاسبة الداخلية.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث باسم الطالب أو رقم #TRX..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full h-10 pr-9 pl-4 text-xs font-mono rounded-xl border border-white/10 bg-[#090d14] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono">
                    <th className="py-3 px-4">رقم العملية</th>
                    <th className="py-3 px-4">التوقيت الدقيق</th>
                    <th className="py-3 px-4">الطالب والجامعة</th>
                    <th className="py-3 px-4">الخصم المطبق</th>
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
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{log.timestamp}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{log.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {log.studentId} • {log.university}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[11px]">
                          {log.discountLabel}
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
      {/* Simulated Camera Scanner Modal */}
      {/* ========================================================================= */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1724] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">ماسح QR Code الميداني للكاشير</h3>
              </div>
              <button
                type="button"
                onClick={() => setScannerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Camera Viewport Simulation */}
            <div className="relative w-full h-64 rounded-xl bg-black overflow-hidden border border-emerald-500/40 flex items-center justify-center">
              {/* Laser Scanning Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce top-1/2" />

              {/* Viewfinder brackets */}
              <div className="w-48 h-48 border-2 border-dashed border-emerald-400/60 rounded-2xl flex items-center justify-center">
                <QrCode className="h-24 w-24 text-emerald-500/20" />
              </div>

              <div className="absolute bottom-3 text-[11px] font-mono text-emerald-400 bg-black/60 px-3 py-1 rounded-full">
                وجّه الكاميرا نحو رمز QR بهاتف الطالب...
              </div>
            </div>

            {/* Quick Simulate Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-400 block text-start">محاكاة مسح رمز الطالب:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  onClick={() => {
                    setScannerOpen(false);
                    setVoucherCode("MASAR20");
                    handleVerifyCode("MASAR20");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 rounded-xl"
                >
                  مسح كود عمر (خصم 20%)
                </Button>

                <Button
                  onClick={() => {
                    setScannerOpen(false);
                    setVoucherCode("BURGER50");
                    handleVerifyCode("BURGER50");
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-10 rounded-xl"
                >
                  مسح كود سارة (BOGO)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Deal Builder Modal (إنشاء عرض جديد) */}
      {/* ========================================================================= */}
      {isNewDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1724] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-start">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">إضافة عرض وترويج طلابي جديد</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewDealModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">عنوان العرض</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: خصم 25% على كافة وجبات الغداء"
                  value={newDealForm.title}
                  onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">التصنيف</label>
                  <select
                    value={newDealForm.category}
                    onChange={(e) => setNewDealForm({ ...newDealForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="وجبات">🍔 وجبات ومطاعم</option>
                    <option value="مشروبات">☕ مقاهي ومشروبات</option>
                    <option value="مكتبات">📚 قرطاسية ومكتبات</option>
                    <option value="خدمات">💻 خدمات وتقنية</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">نوع الخصم</label>
                  <select
                    value={newDealForm.discountType}
                    onChange={(e) =>
                      setNewDealForm({
                        ...newDealForm,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="text-slate-300 font-semibold mb-1 block">قيمة الخصم المعلنة</label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: 20% أو بطاطا مجانية"
                    value={newDealForm.discountValue}
                    onChange={(e) => setNewDealForm({ ...newDealForm, discountValue: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">الحد الأقصى للكوبونات</label>
                  <input
                    required
                    type="number"
                    min={10}
                    placeholder="مثال: 300"
                    value={newDealForm.totalCap}
                    onChange={(e) => setNewDealForm({ ...newDealForm, totalCap: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">تاريخ الانتهاء</label>
                <input
                  required
                  type="date"
                  value={newDealForm.validUntil}
                  onChange={(e) => setNewDealForm({ ...newDealForm, validUntil: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">الشروط والأحكام</label>
                <textarea
                  rows={2}
                  value={newDealForm.terms}
                  onChange={(e) => setNewDealForm({ ...newDealForm, terms: e.target.value })}
                  className="w-full p-3 rounded-xl border border-white/10 bg-[#090d14] text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="border-white/10 text-white hover:bg-white/10 h-10 text-xs"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 text-xs px-5 rounded-xl"
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
