"use client";

import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Inbox,
  Calendar,
  Clock,
  Zap,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiMetricsRibbonProps {
  readyCandidatesCount?: number;
  readyCandidatesGrowth?: string;
  minReadinessScore?: number;

  totalApplicationsCount?: number;
  unreadApplicationsCount?: number;
  activeVacanciesCount?: number;

  scheduledInterviewsCount?: number;
  nearestInterviewToday?: {
    time: string;
    candidateName: string;
    role?: string;
  } | null;

  timeToHireDays?: number;
  marketAverageDays?: number;

  className?: string;
}

export function ExecutiveKpiRibbon({
  readyCandidatesCount = 142,
  readyCandidatesGrowth = "+18% هذا الفصل",
  minReadinessScore = 75,

  totalApplicationsCount = 86,
  unreadApplicationsCount = 14,
  activeVacanciesCount = 4,

  scheduledInterviewsCount = 12,
  nearestInterviewToday = {
    time: "2:30 م",
    candidateName: "عمر خالد",
    role: "مهندس واجهات",
  },

  timeToHireDays = 14,
  marketAverageDays = 20,

  className,
}: KpiMetricsRibbonProps) {
  const daysSaved = Math.max(marketAverageDays - timeToHireDays, 0);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full",
        className
      )}
      dir="rtl"
    >
      {/* =========================================================================
          CARD 1: مرشحون جاهزون لسوق العمل (Market-Ready Candidates)
          Hover: Emerald glow & border
          ========================================================================= */}
      <Link
        href="/company/talents"
        className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f1724] p-5 sm:p-6 transition-all duration-200 ease-out hover:border-emerald-500/60 dark:hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 flex flex-col justify-between"
      >
        <div>
          {/* Top Header Row: Status Dot + Title + Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Glowing Status Dot (Emerald) */}
              <span className="relative flex h-2.5 w-2.5" title="مباشر — جاهزية نشطة">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                مرشحون جاهزون لسوق العمل
              </span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          {/* Primary Metric: Bold Numbers */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {readyCandidatesCount}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              مرشح مؤهل
            </span>
          </div>
        </div>

        {/* Footer Badges & Indicators */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
          {/* Growth Tag */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-3 w-3" />
            <span>{readyCandidatesGrowth}</span>
          </div>

          {/* Readiness Score Threshold Tag */}
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
            <span>جاهزية</span>
            <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              +{minReadinessScore}%
            </strong>
          </div>
        </div>
      </Link>

      {/* =========================================================================
          CARD 2: طلبات التدريب النشطة (Active Applications)
          Hover: Indigo glow & border
          ========================================================================= */}
      <Link
        href="/company/ats"
        className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f1724] p-5 sm:p-6 transition-all duration-200 ease-out hover:border-indigo-500/60 dark:hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 flex flex-col justify-between"
      >
        <div>
          {/* Top Header Row: Status Dot + Title + Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Glowing Status Dot (Indigo) */}
              <span className="relative flex h-2.5 w-2.5" title="تحديث مستمر">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                طلبات التدريب النشطة
              </span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Inbox className="h-4 w-4" />
            </div>
          </div>

          {/* Primary Metric: Bold Numbers */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {totalApplicationsCount}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              إجمالي المتقدمين
            </span>
          </div>
        </div>

        {/* Footer Badges & Unread Notification Alert */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
          {/* Unread Alert Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{unreadApplicationsCount} طلب غير مقروء</span>
          </div>

          {/* Active Vacancies Tag */}
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {activeVacanciesCount} شواغر مفتوحة
          </span>
        </div>
      </Link>

      {/* =========================================================================
          CARD 3: المقابلات المجدولة (Scheduled Interviews)
          Hover: Indigo/Purple glow & border
          ========================================================================= */}
      <Link
        href="/company/ats"
        className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f1724] p-5 sm:p-6 transition-all duration-200 ease-out hover:border-indigo-500/60 dark:hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 flex flex-col justify-between"
      >
        <div>
          {/* Top Header Row: Status Dot + Title + Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Glowing Status Dot (Indigo/Purple) */}
              <span className="relative flex h-2.5 w-2.5" title="مواعيد هذا الأسبوع">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                المقابلات المجدولة
              </span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          {/* Primary Metric: Bold Numbers */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {scheduledInterviewsCount}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              مقابلة هذا الأسبوع
            </span>
          </div>
        </div>

        {/* Footer Badges & Nearest Interview Time Indicator */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
          {nearestInterviewToday ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 max-w-full truncate">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">
                أقرب موعد: <strong>اليوم {nearestInterviewToday.time}</strong>
                {nearestInterviewToday.candidateName ? ` (${nearestInterviewToday.candidateName})` : ""}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              لا توجد مقابلات اليوم
            </span>
          )}
        </div>
      </Link>

      {/* =========================================================================
          CARD 4: متوسط زمن إغلاق الشاغر (Time to Hire)
          Hover: Emerald/Teal glow & border
          ========================================================================= */}
      <Link
        href="/company/analytics"
        className="group relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f1724] p-5 sm:p-6 transition-all duration-200 ease-out hover:border-emerald-500/60 dark:hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 flex flex-col justify-between"
      >
        <div>
          {/* Top Header Row: Status Dot + Title + Icon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Glowing Status Dot (Teal/Emerald) */}
              <span className="relative flex h-2.5 w-2.5" title="كفاءة التوظيف">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                متوسط زمن إغلاق الشاغر
              </span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          {/* Primary Metric: Bold Numbers */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {timeToHireDays}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              يوماً (Time to Hire)
            </span>
          </div>
        </div>

        {/* Footer Badges: Market Benchmark Comparison */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingDown className="h-3 w-3" />
            <span>أسرع بـ {daysSaved} أيام من السوق ({marketAverageDays} يوماً)</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
