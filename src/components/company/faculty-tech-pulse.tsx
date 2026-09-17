"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  Lightbulb,
  Layers,
  ArrowUpRight,
  Code2,
  FolderGit2,
  Cpu,
  Globe,
  Database,
  Smartphone,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TechSkillMetric {
  name: string;
  category: "web" | "ai" | "mobile" | "devops" | "backend";
  percentage: number;
  projectCount: number;
  growth: number; // e.g. +45, 0, -34
  trendLabel: string;
  color: string;
}

const FACULTY_TECH_DATA: TechSkillMetric[] = [
  {
    name: "Next.js & React",
    category: "web",
    percentage: 74,
    projectCount: 88,
    growth: 45,
    trendLabel: "+45% صعود حاد",
    color: "#6366f1", // Indigo
  },
  {
    name: "TypeScript",
    category: "web",
    percentage: 68,
    projectCount: 76,
    growth: 38,
    trendLabel: "+38% صعود",
    color: "#3b82f6", // Blue
  },
  {
    name: "Python & AI Models",
    category: "ai",
    percentage: 56,
    projectCount: 52,
    growth: 52,
    trendLabel: "+52% صعود قياسي",
    color: "#10b981", // Emerald
  },
  {
    name: "Node.js & APIs",
    category: "backend",
    percentage: 51,
    projectCount: 47,
    growth: 22,
    trendLabel: "+22% صعود",
    color: "#06b6d4", // Cyan
  },
  {
    name: "Docker & DevOps",
    category: "devops",
    percentage: 38,
    projectCount: 34,
    growth: 29,
    trendLabel: "+29% صعود",
    color: "#8b5cf6", // Purple
  },
  {
    name: "Flutter & Dart",
    category: "mobile",
    percentage: 31,
    projectCount: 28,
    growth: 2,
    trendLabel: "مستقر (نمط ثابت)",
    color: "#f59e0b", // Amber
  },
  {
    name: "PHP & Laravel",
    category: "backend",
    percentage: 14,
    projectCount: 12,
    growth: -34,
    trendLabel: "-34% تراجع تدريجي",
    color: "#ef4444", // Red / decline
  },
];

const TOP_GROWING_TRACKS = [
  {
    id: "track-1",
    title: "AI & Data Engineering",
    growth: "+52%",
    projectCount: 42,
    topSkills: ["Python", "LangChain", "PyTorch", "SQL"],
    icon: Cpu,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "track-2",
    title: "Full-Stack TypeScript (Next.js & Node)",
    growth: "+41%",
    projectCount: 68,
    topSkills: ["Next.js 15", "TypeScript", "Prisma", "Tailwind"],
    icon: Globe,
    colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    id: "track-3",
    title: "Cloud-Native & Containerization",
    growth: "+29%",
    projectCount: 26,
    topSkills: ["Docker", "Kubernetes", "CI/CD", "Linux"],
    icon: Database,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
];

interface FacultyTechPulseProps {
  className?: string;
  semesterLabel?: string;
  totalTrackedProjects?: number;
}

export function FacultyTechPulse({
  className,
  semesterLabel = "الفصل الثاني 2025/2026",
  totalTrackedProjects = 184,
}: FacultyTechPulseProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "web" | "ai" | "backend">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const filteredData = FACULTY_TECH_DATA.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "web") return item.category === "web";
    if (selectedFilter === "ai") return item.category === "ai";
    if (selectedFilter === "backend") return item.category === "backend" || item.category === "devops";
    return true;
  });

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f1724] p-5 sm:p-6 space-y-6 transition-all shadow-2xs hover:shadow-md",
        className
      )}
      dir="rtl"
    >
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                نبض تقنيات الكلية (Faculty Tech Pulse)
              </h2>
              <span className="relative flex h-2 w-2" title="تتبع فوري نشط">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              رصد حي للمهارات والتقنيات الأكثر استخداماً في مستودعات ومشاريع طلبة الـ IT
            </p>
          </div>
        </div>

        {/* Academic term & Sample badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[11px] font-medium py-1 px-2.5 bg-slate-50 dark:bg-slate-800/50">
            <FolderGit2 className="h-3 w-3 ml-1 text-primary inline" />
            <span>{totalTrackedProjects} مشروع ومستودع GitHub مفحوص</span>
          </Badge>
          <Badge variant="secondary" className="text-[11px] font-semibold py-1 px-2.5">
            {semesterLabel}
          </Badge>
        </div>
      </div>

      {/* 2. Main Grid: Chart on Left (7 cols) + Sidebar Rankings on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            CHART SECTION (lg:col-span-7)
            Horizontal Bar Chart of hands-on skills in student repos
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-foreground">
              نسبة انتشار المهارات في مستودعات التخرج والمواد العملية
            </span>

            {/* Category Filter Pills */}
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/50 dark:bg-slate-900/50 text-[10px]">
              <button
                onClick={() => setSelectedFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer",
                  selectedFilter === "all"
                    ? "bg-white dark:bg-slate-800 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedFilter("web")}
                className={cn(
                  "px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer",
                  selectedFilter === "web"
                    ? "bg-white dark:bg-slate-800 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                واجهات ويب
              </button>
              <button
                onClick={() => setSelectedFilter("ai")}
                className={cn(
                  "px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer",
                  selectedFilter === "ai"
                    ? "bg-white dark:bg-slate-800 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ذكاء اصطناعي
              </button>
              <button
                onClick={() => setSelectedFilter("backend")}
                className={cn(
                  "px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer",
                  selectedFilter === "backend"
                    ? "bg-white dark:bg-slate-800 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                خلفي وسحابي
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-[310px] w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
                    axisLine={{ stroke: isDark ? "#334155" : "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11, fill: isDark ? "#f8fafc" : "#0f172a", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as TechSkillMetric;
                        return (
                          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1.5 min-w-[170px]" dir="rtl">
                            <div className="font-bold text-foreground flex items-center justify-between">
                              <span>{item.name}</span>
                              <span className="font-mono text-primary font-black">{item.percentage}%</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              <span>المستودعات الفعلية: </span>
                              <strong className="text-foreground font-mono">{item.projectCount} مشروع</strong>
                            </div>
                            <div className="pt-1 border-t border-border flex items-center justify-between text-[10px]">
                              <span>معدل التغير:</span>
                              <span
                                className={cn(
                                  "font-semibold px-1.5 py-0.5 rounded",
                                  item.growth > 0
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : item.growth < 0
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                    : "bg-slate-500/10 text-slate-500"
                                )}
                              >
                                {item.trendLabel}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={18}>
                    {filteredData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={0.88}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl animate-pulse" />
            )}
          </div>

          {/* Quick Legend Tags */}
          <div className="flex items-center gap-3 pt-2 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>تقنيات الويب الحديثة (Next.js / TS)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>الذكاء الاصطناعي وهندسة البيانات</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>تقنيات في تراجع مستمر</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            SIDEBAR SECTION (lg:col-span-5)
            Top 3 Fastest-Growing Tracks + Actionable Recruiter Callout
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* A. Top 3 Fastest-Growing Tracks */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-foreground">
                  أكثر 3 مسارات نمواً هذا الفصل
                </h3>
              </div>
              <span className="text-[10px] text-muted-foreground">بناءً على نشاط الكود</span>
            </div>

            <div className="space-y-2">
              {TOP_GROWING_TRACKS.map((track, i) => {
                const Icon = track.icon;
                return (
                  <div
                    key={track.id}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 p-3 hover:border-primary/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {track.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground">
                            {track.projectCount} مشروع نشط
                          </span>
                        </div>
                      </div>

                      <div className={cn("px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border", track.colorClass)}>
                        {track.growth}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {track.topSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-card border border-border/80 text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Actionable Insight Callout (بطاقة توجيه لمسؤول التوظيف) */}
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  توجيه ذكي لمسؤول التوظيف (Recruiter Insight)
                </h4>
                <p className="text-[11px] text-emerald-900/90 dark:text-emerald-300/90 leading-relaxed">
                  <strong>68% من خريجي هذا الفصل</strong> يتقنون React و Node.js بكود مثبت على GitHub.
                  ننصح بفتح شواغر تدريب في <strong>تطوير الواجهات وتطبيقات الويب</strong> لتحقيق سرعة إغلاق قياسية ووصول مباشر لمرشحين جاهزين بنسبة 85%+.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                متوسط وقت التوظيف المتوقع: 10 أيام
              </span>
              <Link href="/company/internships">
                <Button
                  size="sm"
                  className="h-7 text-[10.5px] font-bold px-3 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <span>نشر شاغر مطابق الآن</span>
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
