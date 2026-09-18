"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ScanLine,
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  Hash,
  Copy,
  Check,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Store,
  RotateCcw,
  Search,
  KeyRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MasarLogo } from "@/components/ui/logo";
import { QrCameraScanner } from "@/components/merchant/qr-camera-scanner";
import { playPosSuccessSound, playPosErrorSound } from "@/lib/pos-audio";

// --- Types ---
interface Deal {
  id: string;
  title: string;
  category: string;
  discountType: "percentage" | "bogo" | "freebie" | "fixed";
  discountValue: string;
  usedCount: number;
  totalCap: number;
  maxUsesPerStudent: number;
  isActive: boolean;
}

interface ShiftLog {
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
  usageSequence: string;
}

export default function CashierPosPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Store & Branch Header State
  const [storeName, setStoreName] = useState("مطعم شاورما الضيعة");
  const [cashierName, setCashierName] = useState("كاشير 1 (الرئيسي)");
  const [currentBranch, setCurrentBranch] = useState(
    "فرع الجامعة الأردنية — مجمّع العلوم والطب"
  );
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // Cashier Shift Stats
  const [todayRedemptions, setTodayRedemptions] = useState(14);
  const [shiftSalesVolume, setShiftSalesVolume] = useState(58.4);

  // Per-Student Usage Tracking Map (studentId_dealId -> count)
  const [studentDealUsage, setStudentDealUsage] = useState<Record<string, number>>({
    "202310890_deal-1": 1,
    "202210452_deal-2": 2,
    "202410199_deal-3": 1,
  });

  // Available Store Deals (for matching and limits)
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "deal-1",
      title: "خصم 20% على وجبة الشاورما الكبيرة",
      category: "وجبات فردية",
      discountType: "percentage",
      discountValue: "20%",
      usedCount: 142,
      totalCap: 500,
      maxUsesPerStudent: 3,
      isActive: true,
    },
    {
      id: "deal-2",
      title: "اشترِ وجبة برجر دبل واحصل على الثانية بنصف السعر",
      category: "عروض مزدوجة (BOGO)",
      discountType: "bogo",
      discountValue: "50% على الوجبة الثانية",
      usedCount: 88,
      totalCap: 200,
      maxUsesPerStudent: 2,
      isActive: true,
    },
    {
      id: "deal-3",
      title: "مشروب غازي مجاني مع أي طلب فوق 3 دنانير",
      category: "مشروبات وإضافات",
      discountType: "freebie",
      discountValue: "مشروب مجاني",
      usedCount: 210,
      totalCap: 400,
      maxUsesPerStudent: 5,
      isActive: true,
    },
  ]);

  // Cashier Verification State
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

  // Shift Logs (Transactions during this cashier shift)
  const [logs, setLogs] = useState<ShiftLog[]>([
    {
      id: "log-1",
      trxId: "#TRX-8942",
      studentName: "عمر خالد السعيد",
      studentId: "202310890",
      university: "الجامعة الأردنية",
      dealTitle: "خصم 20% على وجبة الشاورما الكبيرة",
      discountLabel: "خصم 20%",
      originalPrice: 5.0,
      discountAmount: 1.0,
      finalPrice: 4.0,
      timestamp: "منذ دقيقتين (02:43 م)",
      status: "verified",
      usageSequence: "المرة 1 من 3",
    },
    {
      id: "log-2",
      trxId: "#TRX-8941",
      studentName: "سارة أحمد المجالي",
      studentId: "202210452",
      university: "جامعة الأميرة سمية للتكنولوجيا",
      dealTitle: "اشترِ وجبة برجر واحصل على الثانية بنصف السعر",
      discountLabel: "50% على الثانية",
      originalPrice: 8.0,
      discountAmount: 4.0,
      finalPrice: 4.0,
      timestamp: "منذ 14 دقيقة (02:31 م)",
      status: "verified",
      usageSequence: "المرة 2 من 2",
    },
    {
      id: "log-3",
      trxId: "#TRX-8940",
      studentName: "زيد محمود خليل",
      studentId: "202410199",
      university: "الجامعة الألمانية الأردنية",
      dealTitle: "مشروب غازي مجاني مع أي طلب فوق 3 دنانير",
      discountLabel: "مشروب مجاني",
      originalPrice: 4.5,
      discountAmount: 1.5,
      finalPrice: 3.0,
      timestamp: "منذ 35 دقيقة (02:10 م)",
      status: "verified",
      usageSequence: "المرة 1 من 5",
    },
  ]);

  const [logSearchQuery, setLogSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("masar_merchant_email");
      if (!email) {
        router.replace("/merchant/login");
        return;
      }
      if (email.includes("aldiaa")) {
        setStoreName("مطعم شاورما الضيعة");
      }
      const storedCashierName = localStorage.getItem("masar_cashier_name");
      if (storedCashierName) {
        setCashierName(storedCashierName);
      }
      const storedBranch = localStorage.getItem("masar_cashier_branch");
      if (storedBranch) {
        setCurrentBranch(storedBranch);
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

  // --- Handlers: Cashier Instant QR Verification ---
  const handleVerifyCode = (codeToVerify: string) => {
    const code = codeToVerify.trim().toUpperCase();
    if (!code) return;

    setIsVerifying(true);
    setVerificationResult({ status: "idle" });

    setTimeout(() => {
      setIsVerifying(false);

      if (code === "LIMIT_TEST" || code === "MAXED_OUT") {
        playPosErrorSound();
        setVerificationResult({
          status: "error",
          errorMessage:
            "⚠️ تم تجاوز الحد الأقصى المسموح: لقد استنفد هذا الطالب كامل مرات استخدام هذا العرض. غير مسموح بتطبيق الخصم مرة إضافية لنفس الطالب.",
        });
        return;
      }

      if (code === "EXPIRED99") {
        playPosErrorSound();
        setVerificationResult({
          status: "error",
          errorMessage:
            "عذراً، هذا الكوبون منتهي الصلاحية وغير صالح للاستخدام حالياً.",
        });
        return;
      }

      if (code === "USED44") {
        playPosErrorSound();
        setVerificationResult({
          status: "error",
          errorMessage:
            "تم استبدال هذا الكوبون مسبقاً اليوم، الكوبون مستخدم بالفعل.",
        });
        return;
      }

      if (code === "INVALID" || code.length < 4) {
        playPosErrorSound();
        setVerificationResult({
          status: "error",
          errorMessage:
            "رمز الـ QR غير صالح أو أن حساب الطالب غير مسجل بنظام الاعتماد النشط.",
        });
        return;
      }

      // Identify matched deal
      const studentId = "202310890";
      const studentName = "عمر خالد السعيد";

      let matchedDealId = "deal-1";
      if (code.includes("BURGER") || code.includes("50")) matchedDealId = "deal-2";
      if (code.includes("COFFEE") || code.includes("FREE")) matchedDealId = "deal-3";

      const targetDeal = deals.find((d) => d.id === matchedDealId) || deals[0];
      const usageKey = `${studentId}_${targetDeal.id}`;
      const currentStudentUsage = studentDealUsage[usageKey] || 0;

      // Verify student quota limit
      if (currentStudentUsage >= targetDeal.maxUsesPerStudent) {
        setVerificationResult({
          status: "error",
          errorMessage: `⚠️ تجاوز الحد المسموح: لقد استخدم هذا الطالب هذا الكوبون ${currentStudentUsage} من أصل ${targetDeal.maxUsesPerStudent} مرات مسموحة. تم استنفاد الرصيد المخصص لهذا الحساب.`,
        });
        return;
      }

      // Verify total deal cap
      if (targetDeal.usedCount >= targetDeal.totalCap) {
        setVerificationResult({
          status: "error",
          errorMessage: `عذراً، وصل هذا العرض إلى الحد الأقصى الإجمالي لعدد مرات الاستخدام المتفق عليها (${targetDeal.totalCap}/${targetDeal.totalCap} كوبون).`,
        });
        return;
      }

      // Successful Redemption Calculation
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
      playPosSuccessSound();

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
      setTodayRedemptions((prev) => prev + 1);
      setShiftSalesVolume((prev) => Number((prev + result.finalPrice).toFixed(2)));

      // Add to shift logs
      const newLog: ShiftLog = {
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
    setVerificationResult({ status: "idle" });
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.studentName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      l.studentId.includes(logSearchQuery) ||
      l.dealTitle.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      l.trxId.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground flex flex-col font-sans select-none"
    >
      {/* 1. Cashier POS Dedicated Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          {/* Logo & POS Terminal Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <MasarLogo size="sm" priority />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                  مسار
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>محطة الكاشير</span>
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground hidden md:block">
                واجهة الكاشير المستقلة لمسح وتوثيق عروض الطلاب
              </span>
            </div>
          </div>

          {/* Branch & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Cashier Identity Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-400">
              <KeyRound className="h-3.5 w-3.5 shrink-0" />
              <span className="max-w-[150px] truncate">{cashierName}</span>
            </div>

            {/* Branch Selector Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="text-xs text-foreground bg-muted hover:bg-muted/80 border border-border transition-colors flex items-center gap-1.5 font-medium cursor-pointer py-1.5 px-2 sm:px-2.5 rounded-xl"
              >
                <Store className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="max-w-[110px] sm:max-w-[180px] md:max-w-[220px] truncate font-semibold">
                  {currentBranch.split("—")[0]}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                    isBranchDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isBranchDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
                    onClick={() => setIsBranchDropdownOpen(false)}
                  />
                  {/* Position dropdown correctly anchored to right in RTL */}
                  <div className="absolute top-full right-0 mt-2 z-50 w-72 sm:w-80 rounded-xl border border-border bg-card p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground border-b border-border flex items-center justify-between mb-1">
                      <span>اختر فرع نقطة البيع:</span>
                      <button
                        type="button"
                        onClick={() => setIsBranchDropdownOpen(false)}
                        className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
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
                        <span className="truncate">{branch}</span>
                        {currentBranch === branch && (
                          <span className="text-primary text-xs shrink-0">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer"
                title={isDark ? "التحويل للوضع النهاري" : "التحويل للوضع الليلي"}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>
            )}

            {/* Cashier Screen Lock / Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 text-xs font-semibold shrink-0"
              title="تسجيل خروج الكاشير وقفل الشاشة"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>قفل المحطة</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main POS Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        {/* Quick Shift Overview Pills — Responsive 1 col on mobile, 3 cols on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <ScanLine className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-muted-foreground block truncate">
                عمليات الوردية الحالية
              </span>
              <span className="text-base sm:text-lg font-bold text-foreground font-mono">
                {todayRedemptions} عملية
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-muted-foreground block truncate">
                المتجر والفرع
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                {storeName}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-muted-foreground block truncate">
                حالة نقطة البيع (POS)
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
                <span className="truncate">متصل وجاهز للمسح</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Primary POS Scanner Card */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            {/* Scanner Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                مسح رمز الـ QR والتحقق من حساب الطالب
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                وجّه كاميرا الجهاز إلى هاتف الطالب لمسح الكوبون وتوثيق الخصم وخصم المحاولة تلقائياً.
              </p>
            </div>

            {/* QR Scanner Big Action Hero Box */}
            <div className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-background/50 p-5 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-950/20 shrink-0">
                <QrCode className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  جاهز لمسح باركود الطالب (QR Code)
                </h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  يدعم الكاميرا الأمامية والخلفية للهواتف والأجهزة اللوحية والماسحات الضوئية.
                </p>
              </div>

              <div className="w-full max-w-md pt-1 sm:pt-2">
                <Button
                  onClick={() => setScannerOpen(true)}
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Camera className="h-5 w-5 shrink-0" />
                  <span>تشغيل كاميرا المسح الفوري</span>
                </Button>
              </div>
            </div>

            {/* 4. Verification Results: Success Card */}
            {verificationResult.status === "success" && (
              <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/[0.10] via-card to-card p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-start space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-foreground">
                          تم اعتماد الاستخدام بنجاح!
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white dark:text-black font-bold text-[10px] shrink-0">
                          معتمد ✓
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        تم تسجيل العملية وإصدار الرقم المرجعي الموثق.
                      </p>
                    </div>
                  </div>

                  {/* Transaction Reference ID */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 bg-background px-3 py-1.5 rounded-xl border border-border font-mono text-xs text-foreground/80 shrink-0">
                    <span>{verificationResult.trxId}</span>
                    <button
                      type="button"
                      onClick={handleCopyTrx}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0.5"
                      title="نسخ رقم العملية"
                    >
                      {copiedTrx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Highlight: Usage Count / Limit Monitor */}
                <div className="p-4 rounded-xl bg-background/80 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Student Limit Tracker */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-foreground/80 font-semibold flex items-center gap-1.5 truncate">
                        <UserCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="truncate">سجل استخدام الطالب للكود:</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm shrink-0">
                        المرة {verificationResult.studentUsageCount} من{" "}
                        {verificationResult.studentMaxAllowed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>الحصة المتبقية:</span>
                      <span className="font-bold text-amber-500">
                        {verificationResult.remainingForStudent &&
                        verificationResult.remainingForStudent > 0
                          ? `${verificationResult.remainingForStudent} مرات متبقية`
                          : "تم استنفاد كامل الحصة"}
                      </span>
                    </div>
                  </div>

                  {/* Store Deal Total Cap Tracker */}
                  <div className="space-y-1.5 min-w-0 pt-3 sm:pt-0 sm:border-s sm:border-border sm:ps-4 border-t sm:border-t-0 border-border/60">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-foreground/80 font-semibold flex items-center gap-1.5 truncate">
                        <Hash className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="truncate">إجمالي استهلاك الكود:</span>
                      </span>
                      <span className="font-mono text-foreground font-bold shrink-0">
                        {verificationResult.dealCurrentUsage} /{" "}
                        {verificationResult.dealTotalCap}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-background border border-border space-y-1.5 min-w-0">
                    <span className="text-muted-foreground block text-[11px]">بيانات الطالب المستفيد:</span>
                    <p className="text-sm font-bold text-foreground truncate">
                      {verificationResult.studentName}
                    </p>
                    <p className="text-muted-foreground font-mono text-[11px]">
                      رقم جامعي: {verificationResult.studentId}
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 text-[11px] truncate">
                      {verificationResult.university}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-background border border-border space-y-1.5 min-w-0">
                    <span className="text-muted-foreground block text-[11px]">تفاصيل الخصم المطبق:</span>
                    <p className="text-sm font-bold text-amber-500 truncate">
                      {verificationResult.dealTitle}
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border mt-1 font-mono">
                      <span className="text-muted-foreground">قيمة الفاتورة الأصلية:</span>
                      <span className="text-foreground/80 line-through">
                        {verificationResult.originalPrice?.toFixed(2)} د.أ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>المبلغ الموفر للطالب:</span>
                      <span>- {verificationResult.discountAmount?.toFixed(2)} د.أ</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-foreground font-extrabold pt-1 border-t border-border">
                      <span>المبلغ المستحق للدفع:</span>
                      <span className="text-base text-emerald-600 dark:text-emerald-400">
                        {verificationResult.finalPrice?.toFixed(2)} د.أ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Scan Action — Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-muted-foreground font-mono text-center sm:text-start">
                    تمت معالجة الخصم بنجاح وتحديث عداد الاستخدام
                  </span>

                  <Button
                    size="sm"
                    onClick={handleResetCashier}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-10 sm:h-9 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <QrCode className="h-3.5 w-3.5 shrink-0" />
                    <span>مسح QR جديد (العملية التالية)</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Error Result Card */}
            {verificationResult.status === "error" && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 sm:p-5 text-rose-600 dark:text-rose-400 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-500" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-bold text-sm">تعذر استبدال الكوبون</h4>
                    <p className="text-xs leading-relaxed text-foreground/80">
                      {verificationResult.errorMessage}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetCashier}
                    className="w-full sm:w-auto border-rose-500/30 hover:bg-rose-500/10 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 rounded-xl"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>إعادة المحاولة ومسح QR آخر</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Cashier Shift Transactions Log (Read-only) */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                سجل عمليات وردية الكاشير الحالية
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                عرض العمليات المعتمدة للطلبة خلال دوام هذه الوردية في {currentBranch.split("—")[0]}
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث باسم الطالب أو رقم العملية..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="w-full h-9 pr-9 pl-3 rounded-xl border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          {/* Table with horizontal scroll container and min-width to avoid column collisions */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right min-w-[550px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold whitespace-nowrap">
                  <th className="py-3 px-4">رقم العملية</th>
                  <th className="py-3 px-4">الطالب</th>
                  <th className="py-3 px-4">العرض والخصم</th>
                  <th className="py-3 px-4 text-center">المبلغ المدفوع</th>
                  <th className="py-3 px-4 text-center">الوقت</th>
                  <th className="py-3 px-4 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      لا توجد عمليات تطابق البحث
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-foreground whitespace-nowrap">
                        {log.trxId}
                      </td>
                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="font-semibold text-foreground truncate">
                          {log.studentName}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {log.university}
                        </div>
                      </td>
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="text-foreground font-medium truncate">{log.dealTitle}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          {log.discountLabel} ({log.usageSequence})
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {log.finalPrice.toFixed(2)} د.أ
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground text-[11px] whitespace-nowrap font-mono">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>معتمد</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 6. Live Camera Modal Dialog */}
      <QrCameraScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(detectedCode) => {
          setScannerOpen(false);
          handleVerifyCode(detectedCode);
        }}
      />
    </div>
  );
}
