"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Eye,
  Users,
  Target,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Zap,
  BarChart2,
  RefreshCw,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnalyticsData {
  kpis: {
    totalJobViews: number;
    totalApplications: number;
    conversionRate: number;
    matchRate: number;
    timeToHireDays: number;
    timeToHireImprovement: number;
    acceptedOffers: number;
    activeVacanciesCount: number;
  };
  weeklyTrends: Array<{
    week: string;
    applications: number;
    views: number;
    rate: number;
  }>;
  applicantSkillsDistribution: Array<{
    skill: string;
    count: number;
    qualifiedCount: number;
    percentage: number;
  }>;
  facultyTalentInsights: {
    facultyName: string;
    academicTerm: string;
    totalTrackedStudents: number;
    fastestGrowingSkills: Array<{
      name: string;
      growth: string;
      category: string;
      studentCount: number;
      readinessAvg: string;
      demandLevel: string;
    }>;
    cohortBreakdown: Array<{
      label: string;
      count: number;
      percent: number;
    }>;
    strategicRecommendations: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      actionLabel: string;
    }>;
  };
  vacancyPerformance: Array<{
    id: string;
    title: string;
    viewsCount: number;
    applicationsCount: number;
    conversionRate: number;
    matchRate: number;
    avgTimeToHire: number;
  }>;
}

export default function CompanyAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"4w" | "8w" | "term">("8w");
  const [selectedVacancy, setSelectedVacancy] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [skillsFilter, setSkillsFilter] = useState<"all" | "qualified">("all");

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/company/analytics?timeframe=${timeframe}&internshipId=${selectedVacancy}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, selectedVacancy]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4" dir="rtl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          جاري استخراج مؤشرات الأداء ورادار المواهب الأكاديمية...
        </p>
      </div>
    );
  }

  const { kpis, weeklyTrends, applicantSkillsDistribution, facultyTalentInsights, vacancyPerformance } = data;

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <BarChart2 className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              تحليلات وإحصاءات التوظيف (Employer Analytics)
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            مؤشرات دقيقة حول قمع الاستقطاب، سرعة إغلاق الشواغر، وسلوك الطلاب، مع رادار المواهب الأكاديمية الصاعدة.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe switcher */}
          <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40">
            <button
              onClick={() => setTimeframe("4w")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === "4w"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              آخر 4 أسابيع
            </button>
            <button
              onClick={() => setTimeframe("8w")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === "8w"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              آخر 8 أسابيع
            </button>
            <button
              onClick={() => setTimeframe("term")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === "term"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              الفصل الحالي
            </button>
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>

          <Link href="/company/ats">
            <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>مسار التوظيف (ATS)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Cards Grid (Requirement 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Job Views */}
        <Card className="p-5 relative overflow-hidden transition-all hover:shadow-md border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              إجمالي مشاهدات الشواغر (Total Views)
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-foreground">
                {kpis.totalJobViews.toLocaleString()}
              </span>
              <Badge variant="outline" className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800">
                +14.2% مقارنة بالدورة السابقة
              </Badge>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
              <span>معدل التحويل للتقديم:</span>
              <span className="font-bold text-foreground">{kpis.conversionRate}%</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Applications & Match Rate % */}
        <Card className="p-5 relative overflow-hidden transition-all hover:shadow-md border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              الطلبات ومعدل التطابق (Match Rate)
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-foreground">
                {kpis.totalApplications}
              </span>
              <span className="text-xs text-muted-foreground">طلب مستلم</span>
            </div>
            {/* Match Rate progress bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">معدل التطابق التقني:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{kpis.matchRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.matchRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* KPI 3: Time-to-Hire in days */}
        <Card className="p-5 relative overflow-hidden transition-all hover:shadow-md border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              متوسط زمن التوظيف (Time-to-Hire)
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-foreground">
                {kpis.timeToHireDays}
              </span>
              <span className="text-xs text-muted-foreground">يوم عمل</span>
              <Badge variant="outline" className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800">
                أسرع بـ {kpis.timeToHireImprovement} أيام
              </Badge>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
              <span>معدل الفرز الأولي:</span>
              <span className="font-bold text-foreground">3.4 أيام فقط</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Accepted / Filled Offers */}
        <Card className="p-5 relative overflow-hidden transition-all hover:shadow-md border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              عقود التدريب المقبولة (Filled Offers)
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-foreground">
                {kpis.acceptedOffers}
              </span>
              <span className="text-xs text-muted-foreground">متدرب مقبول</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
              <span>نسبة قبول العروض:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">92.3% من العروض</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Interactive Charts Section (Requirement 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Weekly Application Trend (Area Chart) */}
        <Card className="p-6 border-border/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  حجم الإقبال وتدفق طلبات التقديم (Applications Volume)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  رصد مساحي للمشاهدات مقابل طلبات التقديم المستلمة عبر الأسابيع الأخيرة
                </p>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                Area Chart
              </Badge>
            </div>

            <div className="h-72 w-full mt-6" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    className="text-muted-foreground"
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    className="text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      direction: "rtl",
                      color: "var(--foreground)",
                    }}
                    formatter={(val: any, name: any) => {
                      if (name === "views") return [val, "المشاهدات"];
                      if (name === "applications") return [val, "الطلبات المستلمة"];
                      return [val, name];
                    }}
                    labelFormatter={(label) => `الفترة: ${label}`}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 15, fontSize: "12px" }}
                    formatter={(value) => {
                      return value === "views" ? "المشاهدات (Views)" : "طلبات التقديم (Applications)";
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              ذروة الإقبال سُجلت في الأسبوع السادس بالتزامن مع إعلانات الكلية.
            </span>
            <span className="font-semibold text-foreground">متوسط 27 طلب/أسبوع</span>
          </div>
        </Card>

        {/* Chart B: Applicant Skills Distribution (Bar Chart) */}
        <Card className="p-6 border-border/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-600" />
                  توزيع المتقدمين حسب المهارات (Skill Distribution)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  مقارنة أعداد الكفاءات البرمجية والمهارات المعتمدة في طلبات المتقدمين
                </p>
              </div>

              {/* Toggle switch between all vs qualified */}
              <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
                <button
                  onClick={() => setSkillsFilter("all")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    skillsFilter === "all"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSkillsFilter("qualified")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    skillsFilter === "qualified"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  المؤهلون فقط
                </button>
              </div>
            </div>

            <div className="h-72 w-full mt-6" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicantSkillsDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis
                    dataKey="skill"
                    tick={{ fill: "currentColor", fontSize: 10 }}
                    className="text-muted-foreground"
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    className="text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      direction: "rtl",
                      color: "var(--foreground)",
                    }}
                    formatter={(val: any, name: any) => {
                      if (name === "count") return [val, "إجمالي الطلاب"];
                      if (name === "qualifiedCount") return [val, "مؤهل للمقابلة"];
                      return [val, name];
                    }}
                    labelFormatter={(label) => `التقنية: ${label}`}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 15, fontSize: "12px" }}
                    formatter={(value) => {
                      return value === "count" ? "إجمالي المتقدمين" : "مؤهلون فنياً (Readiness 75%+)";
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  {skillsFilter === "qualified" && (
                    <Bar
                      dataKey="qualifiedCount"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              أعلى كثافة مهارات موجودة في بيئة React و TypeScript و Tailwind.
            </span>
            <span className="font-semibold text-foreground">84% معدل جاهزية كود</span>
          </div>
        </Card>
      </div>

      {/* 4. Faculty Talent Insights Box (Requirement 3) */}
      <Card className="p-6 md:p-8 border-primary/20 bg-gradient-to-b from-primary/[0.03] to-transparent shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-foreground">
                تقرير ورادار المواهب الجامعية (Faculty Talent Insights)
              </h2>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                مباشر من الجامعات الشريكة
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              رصد تحليلي للتقنيات الأكثر نمواً بين طلاب {facultyTalentInsights.facultyName} — لمساعدتك في تخطيط مسارات التدريب الصيفي واصطياد الكفاءات مبكراً.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{facultyTalentInsights.academicTerm}</span>
            <span className="text-border">|</span>
            <span>{facultyTalentInsights.totalTrackedStudents.toLocaleString()} طالب مرصود</span>
          </div>
        </div>

        {/* Content: Fastest Growing Skills + Cohort Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Fastest Growing Skills (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              المهارات والتقنيات الأكثر نمواً بين طلاب الكلية لهذا الفصل
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facultyTalentInsights.fastestGrowingSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {skill.category}
                      </span>
                      <h4 className="text-sm font-bold text-foreground mt-0.5">
                        {skill.name}
                      </h4>
                    </div>
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                      {skill.growth} نمو
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-border/60 text-muted-foreground">
                    <span>{skill.studentCount} طالب منجز مشاريع</span>
                    <span className="font-semibold text-foreground">
                      جاهزية: {skill.readinessAvg}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Cohorts Breakdown (1 col) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-500" />
              توزيع الدفعات الأكاديمية المؤهلة للتدريب
            </h3>

            <div className="p-4 rounded-xl border border-border bg-card space-y-4">
              {facultyTalentInsights.cohortBreakdown.map((cohort) => (
                <div key={cohort.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{cohort.label}</span>
                    <span className="font-bold text-primary">{cohort.count} طالب</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${cohort.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-lg bg-muted/50 text-[11px] text-muted-foreground leading-relaxed">
                💡 <strong className="text-foreground">توصية الأكاديميا:</strong> أكثر من 52% من طلاب السنة الثالثة ملزمون بإنهاء 300 ساعة تدريب صيفي معتمدة قبل بداية الفصل الأول القادم.
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Hiring Recommendations */}
        <div className="mt-8 pt-6 border-t border-border/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            توصيات الذكاء الاصطناعي الاستراتيجية لتخطيط التدريب الصيفي
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facultyTalentInsights.strategicRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-border bg-card/60 flex flex-col justify-between space-y-3 hover:bg-card transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-tight">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <Link href="/company/talents">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-bold text-primary hover:text-primary gap-1 w-full justify-between">
                      <span>{rec.actionLabel}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 5. Detailed Performance Breakdown by Internship */}
      <Card className="p-6 border-border/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              أداء الشواغر التدريبية ومعدلات التحويل بالتفصيل
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              مقارنة دقيقة لكل شاغر: عدد المشاهدات، نسبة الإقبال، ومعدل زمن إغلاق الشاغر
            </p>
          </div>
          <Link href="/company/internships">
            <Button variant="outline" size="sm" className="text-xs font-semibold h-8 gap-1.5">
              <span>إدارة كافة الفرص</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-right text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-r-lg">عنوان الشاغر التدريبي</th>
                <th className="px-4 py-3">المشاهدات</th>
                <th className="px-4 py-3">الطلبات المستلمة</th>
                <th className="px-4 py-3">معدل التحويل (Conversion)</th>
                <th className="px-4 py-3">معدل التطابق</th>
                <th className="px-4 py-3 rounded-l-lg">متوسط زمن التوظيف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {vacancyPerformance.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.viewsCount}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">
                    {item.applicationsCount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                      {item.conversionRate}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {item.matchRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="font-semibold text-foreground">{item.avgTimeToHire}</span> أيام
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
