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
  // Active Tab: "redemption" | "deals" | "logs"
  const [activeTab, setActiveTab] = useState<
    "redemption" | "deals" | "logs" | "anti-fraud" | "settlements" | "campus-drops"
  >("redemption");

  // Store & Branch Header State
  const [storeName, setStoreName] = useState("مطعم شاورما الضيعة");
  const [currentBranch, setCurrentBranch] = useState("فرع الجامعة الأردنية — مجمّع العلوم والطب");
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // --- Per-Student Usage Tracking Map (studentId_dealId -> count) ---
  const [studentDealUsage, setStudentDealUsage] = useState<Record<string, number>>({
    "202310890_deal-1": 1, // عمر خالد استخدم عرض الشاورما مرة واحدة سابقاً
    "202210452_deal-2": 2, // سارة أحمد استخدمت عرض BOGO مرتين
    "202410199_deal-3": 1, // زيد محمود استخدم المشروب المجاني مرة واحدة
  });

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
    studentUsageCount?: number;
    studentMaxAllowed?: number;
    dealCurrentUsage?: number;
    dealTotalCap?: number;
    remainingForStudent?: number;
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

  // --- Handlers: Tab 1 Redemption with Full Usage Cap Logic ---
  const handleVerifyCode = (codeToVerify?: string) => {
    const code = (codeToVerify || voucherCode).trim().toUpperCase();
    if (!code) return;

    setIsVerifying(true);
    setVerificationResult({ status: "idle" });

    setTimeout(() => {
      setIsVerifying(false);

      // 1. Explicit Exceeded Limit Test Simulation
      if (code === "LIMIT_TEST" || code === "MAXED_OUT") {
        setVerificationResult({
          status: "error",
          errorMessage:
            "⚠️ تم تجاوز الحد الأقصى المسموح: لقد استنفد الطالب (عمر خالد) كامل مرات استخدام هذا الكوبون (3 من أصل 3 مرات سابقة). غير مسموح بتطبيق الخصم مرة رابعة لنفس الطالب!",
        });
        return;
      }

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

      // 2. Identify target deal and student info
      const studentId = "202310890";
      const studentName = "عمر خالد السعيد";

      let matchedDealId = "deal-1";
      if (code.includes("BURGER") || code.includes("50")) matchedDealId = "deal-2";
      if (code.includes("COFFEE") || code.includes("FREE")) matchedDealId = "deal-3";

      const targetDeal = deals.find((d) => d.id === matchedDealId) || deals[0];
      const usageKey = `${studentId}_${targetDeal.id}`;
      const currentStudentUsage = studentDealUsage[usageKey] || 0;

      // 3. Verify student quota limit
      if (currentStudentUsage >= targetDeal.maxUsesPerStudent) {
        setVerificationResult({
          status: "error",
          errorMessage: `⚠️ تجاوز الحد المسموح: لقد استخدم هذا الطالب هذا الكوبون ${currentStudentUsage} من أصل ${targetDeal.maxUsesPerStudent} مرات مسموحة. تم استنفاد الرصيد المخصص لهذا الحساب.`,
        });
        return;
      }

      // 4. Verify total deal cap
      if (targetDeal.usedCount >= targetDeal.totalCap) {
        setVerificationResult({
          status: "error",
          errorMessage: `عذراً، وصل هذا العرض إلى الحد الأقصى الإجمالي لعدد مرات الاستخدام المتفق عليها (${targetDeal.totalCap}/${targetDeal.totalCap} كوبون).`,
        });
        return;
      }

      // 5. Successful Redemption Calculation
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTrx = `#TRX-${randomNum}`;
      const newStudentUsage = currentStudentUsage + 1;
      const remainingForStudent = targetDeal.maxUsesPerStudent - newStudentUsage;

      let orig = 10.0;
      let disc = 2.0;

      if (targetDeal.discountType === "bogo") {
        orig = 8.0;
        disc = 4.0;
      } else if (targetDeal.discountType === "freebie") {
        orig = 4.5;
        disc = 1.5;
      } else if (targetDeal.discountType === "fixed") {
        orig = 15.0;
        disc = 2.5;
      }

      const result = {
        status: "success" as const,
        studentName,
        studentId,
        university: "جامعة عمان الأهلية",
        major: "هندسة البرمجيات • السنة الثالثة",
        dealTitle: targetDeal.title,
        originalPrice: orig,
        discountAmount: disc,
        finalPrice: Number((orig - disc).toFixed(2)),
        trxId: newTrx,
        studentUsageCount: newStudentUsage,
        studentMaxAllowed: targetDeal.maxUsesPerStudent,
        dealCurrentUsage: targetDeal.usedCount + 1,
        dealTotalCap: targetDeal.totalCap,
        remainingForStudent,
      };

      setVerificationResult(result);

      // Increment student's usage in state
      setStudentDealUsage((prev) => ({
        ...prev,
        [usageKey]: newStudentUsage,
      }));

      // Increment total deal used count in state
      setDeals((prev) =>
        prev.map((d) =>
          d.id === targetDeal.id ? { ...d, usedCount: d.usedCount + 1 } : d
        )
      );

      // Update shift stats
      setShiftStats((prev) => ({
        todayRedemptions: prev.todayRedemptions + 1,
        shiftSalesVolume: Number((prev.shiftSalesVolume + result.finalPrice).toFixed(2)),
        studentSavingsTotal: Number((prev.studentSavingsTotal + result.discountAmount).toFixed(2)),
        newStudentCustomers: currentStudentUsage === 0 ? prev.newStudentCustomers + 1 : prev.newStudentCustomers,
      }));

      // Add to logs
      const newLog: RedemptionLog = {
        id: `log-${Date.now()}`,
        trxId: newTrx,
        studentName: result.studentName,
        studentId: result.studentId,
        university: result.university,
        dealTitle: result.dealTitle,
        discountLabel: targetDeal.discountValue,
        originalPrice: result.originalPrice,
        discountAmount: result.discountAmount,
        finalPrice: result.finalPrice,
        timestamp: "الآن (لحظي)",
        status: "verified",
        usageSequence: `المرة ${newStudentUsage} من ${targetDeal.maxUsesPerStudent}`,
      };

      setLogs((prev) => [newLog, ...prev]);
    }, 400);
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
      {/* 1. Fixed / Sticky Top Merchant Header */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xl backdrop-blur-xl">
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
                  className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>{currentBranch}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {isBranchDropdownOpen && (
                  <div className="absolute top-6 right-0 z-30 w-72 rounded-xl border border-border bg-background p-1.5 shadow-2xl space-y-1">
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
                            : "text-foreground/80 hover:bg-white/5"
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
          <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border self-start lg:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("redemption")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "redemption"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-muted-foreground hover:text-white"
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
              onClick={() => setActiveTab("anti-fraud")}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "anti-fraud"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/50"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>مكافحة الاحتيال (Dynamic QR)</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                30s
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settlements")}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "settlements"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>التسويات والفواتير</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                PDF
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("campus-drops")}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "campus-drops"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-950/50"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Radio className="h-4 w-4 text-amber-400" />
              <span>حملات البث للحرم (Drops)</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                Push
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "deals"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>مدير العروض ({deals.filter((d) => d.isActive).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "logs"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>سجل العمليات</span>
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
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header Title & Mode Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                  <ScanLine className="h-3.5 w-3.5" />
                  <span>محطة الكاشير ونقاط البيع الفورية · Fast POS Terminal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  التحقق من كوبون الطالب وحساب الحصة
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  أدخل رمز الخصم أو امسح الـ QR Code بالكاميرا للتحقق من عدد مرات الاستخدام المتبقية للطالب واعتماد الفاتورة.
                </p>
              </div>

              {/* 1. Voucher Input (Large Typography & Mono) */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="MASAR20 أو رمز الخصم"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleVerifyCode();
                      }
                    }}
                    className="w-full h-18 sm:h-20 text-2xl sm:text-3xl font-mono font-bold text-center tracking-[0.2em] rounded-2xl border-2 border-emerald-500/30 bg-background text-white placeholder-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner uppercase"
                  />
                  {voucherCode && (
                    <button
                      type="button"
                      onClick={() => setVoucherCode("")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Quick Test Codes Pills with Limit Testing */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs font-mono">
                  <span className="text-muted-foreground text-[11px]">أكواد تجريبية:</span>
                  {[
                    { label: "MASAR20 (استخدام 1/3)", code: "MASAR20" },
                    { label: "BURGER50 (استخدام 2/2)", code: "BURGER50" },
                    { label: "FREECOFFEE (مشروب 1/5)", code: "FREECOFFEE" },
                    { label: "LIMIT_TEST (تجربة تجاوز الحد)", code: "LIMIT_TEST" },
                    { label: "EXPIRED99 (منتهي)", code: "EXPIRED99" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setVoucherCode(item.code);
                        handleVerifyCode(item.code);
                      }}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        item.code === "LIMIT_TEST"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                          : "border-border bg-white/[0.03] text-foreground/80 hover:border-emerald-500/40 hover:text-emerald-400"
                      }`}
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
                      <span>جاري فحص رصيد الكوبونات...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>تحقق واعتماد الاستخدام</span>
                      <span className="text-[11px] font-mono opacity-75">↵</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setScannerOpen(true)}
                  className="h-13 border-border bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <QrCode className="h-5 w-5 text-amber-400" />
                  <span>مسح الـ QR Code بكاميرا الجهاز</span>
                </Button>
              </div>

              {/* 3. Real-time Feedback Card with Usage Counter Quota */}
              {verificationResult.status === "success" && (
                <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/[0.12] via-[#090d14] to-[#090d14] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-start space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">
                            تم اعتماد الاستخدام بنجاح!
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-bold text-[10px]">
                            معتمد ✓
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          تم تسجيل العملية وإصدار الرقم المرجعي الموثق.
                        </p>
                      </div>
                    </div>

                    {/* Transaction Reference ID */}
                    <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border font-mono text-xs text-foreground/80">
                      <span>{verificationResult.trxId}</span>
                      <button
                        type="button"
                        onClick={handleCopyTrx}
                        className="text-muted-foreground hover:text-white transition-colors"
                        title="نسخ رقم العملية"
                      >
                        {copiedTrx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Highlight: Usage Count / Limit Monitor */}
                  <div className="p-4 rounded-xl bg-card border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    {/* Student Limit Tracker */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground/80 font-semibold flex items-center gap-1.5">
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          <span>سجل استخدام الطالب للكود:</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          المرة {verificationResult.studentUsageCount} من {verificationResult.studentMaxAllowed}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                        <span>الحصة المتبقية للطالب:</span>
                        <span className="font-bold text-amber-400">
                          {verificationResult.remainingForStudent && verificationResult.remainingForStudent > 0
                            ? `${verificationResult.remainingForStudent} مرات متبقية`
                            : "تم استنفاد كامل الحصة"}
                        </span>
                      </div>
                    </div>

                    {/* Store Deal Total Cap Tracker */}
                    <div className="space-y-1.5 sm:border-r sm:border-border sm:pr-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground/80 font-semibold flex items-center gap-1.5">
                          <Hash className="h-4 w-4 text-amber-400" />
                          <span>إجمالي استهلاك الكود بالفرع:</span>
                        </span>
                        <span className="font-mono text-white font-bold">
                          {verificationResult.dealCurrentUsage} / {verificationResult.dealTotalCap}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-background overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((verificationResult.dealCurrentUsage || 1) /
                                  (verificationResult.dealTotalCap || 300)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Student & Deal Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-border/60 space-y-1">
                      <span className="text-muted-foreground">بيانات الطالب المستفيد:</span>
                      <p className="text-sm font-bold text-white">{verificationResult.studentName}</p>
                      <p className="text-muted-foreground font-mono text-[11px]">
                        رقم جامعي: {verificationResult.studentId}
                      </p>
                      <p className="text-emerald-400 text-[11px]">{verificationResult.university}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-border/60 space-y-1">
                      <span className="text-muted-foreground">تفاصيل الخصم المطبق:</span>
                      <p className="text-sm font-bold text-amber-400">{verificationResult.dealTitle}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60 mt-1 font-mono">
                        <span className="text-muted-foreground">قيمة الفاتورة الأصلية:</span>
                        <span className="text-foreground/80 line-through">
                          {verificationResult.originalPrice?.toFixed(2)} د.أ
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                        <span>المبلغ الموفر للطالب:</span>
                        <span>- {verificationResult.discountAmount?.toFixed(2)} د.أ</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-white font-extrabold pt-1 border-t border-border/60">
                        <span>المبلغ المستحق للدفع:</span>
                        <span className="text-base text-emerald-400">
                          {verificationResult.finalPrice?.toFixed(2)} د.أ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reset Cashier Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>محمية ضد التكرار ومقيدة بسقف عدد مرات الاستخدام</span>
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
                        فحص الكود: تم رفض العملية
                      </h4>
                      <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                        {verificationResult.errorMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResetCashier}
                      className="text-xs border-border hover:bg-white/10 text-white h-8 cursor-pointer"
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
            <div className="p-5 rounded-2xl border border-border bg-card space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>استبدالات الوردية اليوم</span>
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
              <p className="text-[11px] text-muted-foreground font-mono">عبر بوابة الدفع السريع والخصومات</p>
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
        </div>
      )}

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
      {/* Real Device Camera QR Scanner Modal */}
      {/* ========================================================================= */}
      <QrCameraScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(code) => {
          setScannerOpen(false);
          setVoucherCode(code);
          handleVerifyCode(code);
        }}
      />

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
