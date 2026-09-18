"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Tag,
  Users,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Building2,
  Printer,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Coffee,
  GraduationCap,
  Store,
  ChevronDown,
  Filter,
  BarChart3,
  Award,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TimeRange = "today" | "week" | "month" | "semester" | "all";

interface DealStat {
  id: string;
  title: string;
  category: string;
  discountLabel: string;
  redemptions: number;
  cap: number;
  revenue: number;
  satisfaction: number;
  popularCampus: string;
}

interface CashierStat {
  id: string;
  name: string;
  branch: string;
  scans: number;
  revenue: number;
  avgSpeed: string;
}

export default function MerchantAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  // Multiplier based on timeRange for dynamic realistic calculations
  const multiplier = useMemo(() => {
    switch (timeRange) {
      case "today":
        return 0.08;
      case "week":
        return 0.35;
      case "month":
        return 1.0;
      case "semester":
        return 3.4;
      case "all":
        return 5.2;
    }
  }, [timeRange]);

  // Branch filter multiplier
  const branchMultiplier = useMemo(() => {
    if (selectedBranch === "all") return 1.0;
    if (selectedBranch === "uj") return 0.46;
    if (selectedBranch === "amman-ahliyya") return 0.24;
    if (selectedBranch === "just") return 0.18;
    if (selectedBranch === "yarmouk") return 0.12;
    return 0.2;
  }, [selectedBranch]);

  const effectiveFactor = multiplier * branchMultiplier;

  // Base Metrics dynamically adapted
  const totalSales = Math.round(1842.5 * effectiveFactor * 10) / 10;
  const discountsGranted = Math.round(468.0 * effectiveFactor * 10) / 10;
  const totalRedemptions = Math.max(1, Math.round(412 * effectiveFactor));
  const uniqueStudents = Math.max(1, Math.round(286 * effectiveFactor));
  const returningRate = 64.8;
  const aov = (totalSales / totalRedemptions).toFixed(2);

  // Hourly Traffic (24 hours)
  const hourlyData = [
    { hour: "08:00", count: Math.round(18 * effectiveFactor), note: "فطور الصباح" },
    { hour: "09:00", count: Math.round(26 * effectiveFactor), note: "بداية المحاضرات" },
    { hour: "10:00", count: Math.round(38 * effectiveFactor), note: "استراحة سريعة" },
    { hour: "11:00", count: Math.round(44 * effectiveFactor), note: "قبل الظهر" },
    { hour: "12:00", count: Math.round(92 * effectiveFactor), isPeak: true, note: "ذروة الغداء الجامعي 🍔" },
    { hour: "13:00", count: Math.round(86 * effectiveFactor), isPeak: true, note: "ذروة الغداء الجامعي" },
    { hour: "14:00", count: Math.round(54 * effectiveFactor), note: "بعد الظهر" },
    { hour: "15:00", count: Math.round(32 * effectiveFactor), note: "المحاضرات المسائية" },
    { hour: "16:00", count: Math.round(22 * effectiveFactor), note: "نهاية الدوام" },
    { hour: "17:00", count: Math.round(14 * effectiveFactor), note: "مسائي" },
  ];

  // Campus breakdown
  const campusBreakdown = [
    {
      name: "الجامعة الأردنية — مجمّع العلوم والطب",
      city: "عمان — الجبيهة",
      percentage: 46,
      students: Math.round(132 * multiplier),
      revenue: (totalSales * 0.46).toFixed(1),
    },
    {
      name: "جامعة عمان الأهلية — البوابة الرئيسية",
      city: "عمان / السلط",
      percentage: 24,
      students: Math.round(68 * multiplier),
      revenue: (totalSales * 0.24).toFixed(1),
    },
    {
      name: "جامعة العلوم والتكنولوجيا (JUST) — المجمّع التجاري",
      city: "إربد — الرمثا",
      percentage: 18,
      students: Math.round(51 * multiplier),
      revenue: (totalSales * 0.18).toFixed(1),
    },
    {
      name: "جامعة اليرموك — شارع الجامعة",
      city: "إربد — قصبة إربد",
      percentage: 12,
      students: Math.round(35 * multiplier),
      revenue: (totalSales * 0.12).toFixed(1),
    },
  ];

  // Top Student Faculties
  const faculties = [
    { name: "كلية تكنولوجيا المعلومات والذكاء الاصطناعي", percentage: 38, icon: "💻" },
    { name: "كلية الطب والعلوم الطبية المخبرية", percentage: 28, icon: "🩺" },
    { name: "كلية الهندسة والتصميم المعماري", percentage: 20, icon: "📐" },
    { name: "كلية إدارة الأعمال والاقتصاد", percentage: 14, icon: "📈" },
  ];

  // Deals Breakdown
  const dealsData: DealStat[] = [
    {
      id: "deal-1",
      title: "خصم 20% على وجبة الشاورما الكبيرة سوبر",
      category: "وجبات فردية",
      discountLabel: "خصم 20%",
      redemptions: Math.round(186 * effectiveFactor),
      cap: 300,
      revenue: Math.round(744 * effectiveFactor),
      satisfaction: 4.9,
      popularCampus: "الجامعة الأردنية",
    },
    {
      id: "deal-2",
      title: "اشترِ وجبة برجر دبل واحصل على الثانية بنصف السعر (BOGO)",
      category: "عروض مزدوجة",
      discountLabel: "50% على الثانية",
      redemptions: Math.round(124 * effectiveFactor),
      cap: 200,
      revenue: Math.round(620 * effectiveFactor),
      satisfaction: 4.8,
      popularCampus: "عمان الأهلية",
    },
    {
      id: "deal-3",
      title: "مشروب غازي مجاني وبطاطا مقرمشة مع أي طلب فوق 3 د.أ",
      category: "إضافات ومشروبات",
      discountLabel: "إضافة مجانية",
      redemptions: Math.round(102 * effectiveFactor),
      cap: 400,
      revenue: Math.round(478 * effectiveFactor),
      satisfaction: 4.7,
      popularCampus: "العلوم والتكنولوجيا",
    },
  ];

  // Cashier Performance
  const cashiersData: CashierStat[] = [
    {
      id: "c1",
      name: "كاشير 1 (الرئيسي — مجمع العلوم)",
      branch: "الجامعة الأردنية",
      scans: Math.round(184 * effectiveFactor),
      revenue: Math.round(828 * effectiveFactor),
      avgSpeed: "0.8 ثانية",
    },
    {
      id: "c2",
      name: "كاشير صالة الطلبة",
      branch: "جامعة عمان الأهلية",
      scans: Math.round(132 * effectiveFactor),
      revenue: Math.round(594 * effectiveFactor),
      avgSpeed: "0.9 ثانية",
    },
    {
      id: "c3",
      name: "كاشير نقطة بيع إربد",
      branch: "العلوم والتكنولوجيا (JUST)",
      scans: Math.round(96 * effectiveFactor),
      revenue: Math.round(420 * effectiveFactor),
      avgSpeed: "0.7 ثانية",
    },
  ];

  const handlePrintReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (typeof window !== "undefined") {
        window.print();
      }
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:space-y-4" dir="rtl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <BarChart3 className="h-4 w-4" />
            <span>بوابة الشركاء · مركز التحليلات والذكاء التجاري</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <span>التقارير والإحصائيات الشاملة</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Data
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            رؤى تشغيلية ومالية تفصيلية، معدلات ولاء الطلاب، ساعات الذروة، وأداء الفروع والكاشيرات
          </p>
        </div>

        {/* Filter Controls & Print Button */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* Branch Filter */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden cursor-pointer"
            >
              <option value="all">كافة الفروع الجامعية</option>
              <option value="uj">فرع الجامعة الأردنية</option>
              <option value="amman-ahliyya">فرع جامعة عمان الأهلية</option>
              <option value="just">فرع العلوم والتكنولوجيا</option>
              <option value="yarmouk">فرع جامعة اليرموك</option>
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-muted border border-border">
            {[
              { id: "today", label: "اليوم" },
              { id: "week", label: "7 أيام" },
              { id: "month", label: "هذا الشهر" },
              { id: "semester", label: "الفصل الحالي" },
              { id: "all", label: "الكل" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id as TimeRange)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  timeRange === tab.id
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export / Print Report Button */}
          <Button
            onClick={handlePrintReport}
            variant="outline"
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>طباعة التقرير</span>
          </Button>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Net Sales */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">صافي مبيعات الطلاب</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground font-mono">{totalSales.toLocaleString()}</span>
            <span className="text-xs font-bold text-muted-foreground">د.أ</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+18.4% نمو إيجابي</span>
          </div>
        </div>

        {/* Card 2: Discounts Value */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">قيمة الخصومات الممنوحة</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground font-mono">{discountsGranted.toLocaleString()}</span>
            <span className="text-xs font-bold text-muted-foreground">د.أ</span>
          </div>
          <span className="text-[11px] text-muted-foreground block font-medium">
            معدل خصم مسار: 20.2%
          </span>
        </div>

        {/* Card 3: Total Redemptions */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">عمليات الاستبدال الموثقة</span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground font-mono">{totalRedemptions}</span>
            <span className="text-xs font-bold text-muted-foreground">عملية</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>100% نجاح التحقق</span>
          </span>
        </div>

        {/* Card 4: Unique Students */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">الطلاب المستفيدون</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground font-mono">{uniqueStudents}</span>
            <span className="text-xs font-bold text-muted-foreground">طالباً فريداً</span>
          </div>
          <span className="text-[11px] text-muted-foreground block font-medium">
            من 4 جامعات شريكة
          </span>
        </div>

        {/* Card 5: Retention & Repeat */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">معدل ولاء الطلاب</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground font-mono">{returningRate}%</span>
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block">
            عادوا للشراء مرتين فأكثر
          </span>
        </div>

        {/* Card 6: Average Order Value */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">متوسط الفاتورة (AOV)</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-foreground font-mono">{aov}</span>
            <span className="text-xs font-bold text-muted-foreground">د.أ</span>
          </div>
          <span className="text-[11px] text-muted-foreground block font-medium">
            متوسط سلة المشتريات
          </span>
        </div>
      </div>

      {/* Grid: Peak Hours Heatmap & Campus Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Hours (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-foreground">ساعات الذروة وتوزيع الإقبال اليومي</h3>
                <p className="text-xs text-muted-foreground">
                  تحديد الأوقات التي يقبل فيها الطلاب بكثافة لضبط المخزون وإطلاق عروض الـ Drops
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              استراحة الغداء (12:00 - 02:00 م)
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
            {hourlyData.map((item) => (
              <div
                key={item.hour}
                className={cn(
                  "p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between",
                  item.isPeak
                    ? "bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/50 shadow-xs"
                    : "bg-background border-border"
                )}
              >
                <span className="text-[11px] font-mono font-semibold text-muted-foreground block">
                  {item.hour}
                </span>
                <span className="text-base font-black text-foreground font-mono my-1 block">
                  {item.count}
                </span>
                <span
                  className={cn(
                    "text-[9px] truncate block leading-tight font-medium",
                    item.isPeak
                      ? "text-amber-700 dark:text-amber-400 font-bold"
                      : "text-muted-foreground"
                  )}
                  title={item.note}
                >
                  {item.note}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              نصيحة مسار: 64% من مبيعات المطعم تسجل بين الساعة 12:00 ظهراً و 02:00 بعد الظهر. ينصح بتجهيز كاشير إضافي في هذه الساعتين.
            </span>
          </div>
        </div>

        {/* Campus Distribution (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">توزيع الإقبال حسب الفروع الجامعية</h3>
                <p className="text-xs text-muted-foreground">حجم المبيعات والطلاب في كل حرم جامعي</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {campusBreakdown.map((campus) => (
              <div key={campus.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{campus.name.split("—")[0]}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-foreground">{campus.revenue} د.أ</span>
                    <span className="text-muted-foreground">({campus.percentage}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${campus.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{campus.city}</span>
                  <span>{campus.students} طالب مستفيد</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Student Faculties Demographics */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <GraduationCap className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">التركيبة الطلابية والكليات الأكثر زيارة</h3>
            <p className="text-xs text-muted-foreground">
              توزيع طلبات الطلاب حسب تخصصاتهم وكلياتهم في الجامعات المجاورة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {faculties.map((f) => (
            <div
              key={f.name}
              className="p-4 rounded-xl bg-background border border-border flex items-center gap-3.5"
            >
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                {f.icon}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-foreground block truncate">
                  {f.name}
                </span>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-muted-foreground">نسبة الإقبال</span>
                  <span className="font-bold text-primary font-mono">{f.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Deals Performance Table */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-foreground">تحليل أداء العروض والخصومات بالتفصيل</h3>
              <p className="text-xs text-muted-foreground">
                معدل الاستخدام، استهلاك السقف الأقصى، والإيرادات الناتجة عن كل عرض
              </p>
            </div>
          </div>
          <Link
            href="/merchant/dashboard?tab=deals"
            className="text-xs font-bold text-primary hover:underline self-start sm:self-auto"
          >
            إدارة كافة العروض ←
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                <th className="py-3 px-4 rounded-r-xl">عنوان العرض</th>
                <th className="py-3 px-4">نسبة الخصم</th>
                <th className="py-3 px-4">عدد الاستخدامات</th>
                <th className="py-3 px-4">استهلاك السقف (Cap)</th>
                <th className="py-3 px-4">الإيراد المحقق</th>
                <th className="py-3 px-4">الحرم الأكثر طلباً</th>
                <th className="py-3 px-4 rounded-l-xl">رضا الطلاب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {dealsData.map((deal) => {
                const capPercent = Math.min(100, Math.round((deal.redemptions / deal.cap) * 100));

                return (
                  <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {deal.title}
                      <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">
                        {deal.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {deal.discountLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground text-sm">
                      {deal.redemptions}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              capPercent > 80 ? "bg-amber-500" : "bg-primary"
                            )}
                            style={{ width: `${capPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {capPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {deal.revenue} د.أ
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {deal.popularCampus}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-500">
                      ★ {deal.satisfaction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cashier Terminals Performance */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Store className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">أداء نقاط بيع الكاشير في الفروع</h3>
            <p className="text-xs text-muted-foreground">
              مقارنة سرعة الفحص وحجم العمليات المنفذة في كل نقطة كاشير
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {cashiersData.map((cashier) => (
            <div
              key={cashier.id}
              className="p-4 rounded-xl bg-background border border-border space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">{cashier.name}</span>
                  <span className="text-[11px] text-muted-foreground">{cashier.branch}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  نشط
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                <div>
                  <span className="text-[10px] text-muted-foreground block">العمليات</span>
                  <span className="font-mono font-bold text-xs text-foreground mt-0.5 block">
                    {cashier.scans}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">المبيعات</span>
                  <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {cashier.revenue} د.أ
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">متوسط السرعة</span>
                  <span className="font-mono font-bold text-xs text-primary mt-0.5 block">
                    {cashier.avgSpeed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
