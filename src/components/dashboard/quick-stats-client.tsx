"use client";

import Link from "next/link";
import { BookOpen, Clock, GraduationCap, CheckSquare, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

interface QuickStatsClientProps {
  coursesCount: number;
  todayDueCount: number;
  totalAssignmentsCount: number;
  totalCredits: number;
}

export function QuickStatsClient({
  coursesCount,
  todayDueCount,
  totalAssignmentsCount,
  totalCredits,
}: QuickStatsClientProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const stats = [
    {
      label: t.dashboard.stats.enrolledCourses,
      value: coursesCount,
      unit: t.dashboard.stats.coursesUnit,
      icon: BookOpen,
      squircleBg: "bg-gradient-to-br from-[#007aff] to-[#0051ba] shadow-[0_4px_16px_rgba(0,122,255,0.4)]",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.todayDue,
      value: todayDueCount,
      unit: t.dashboard.stats.tasksUnit,
      icon: Clock,
      squircleBg: "bg-gradient-to-br from-[#ffd60a] to-[#ff9f0a] shadow-[0_4px_16px_rgba(255,159,10,0.4)]",
      href: "/courses",
    },
    {
      label: isAr ? "الواجبات والاختبارات" : "Tasks & Exams",
      value: totalAssignmentsCount,
      unit: isAr ? "تكليف" : "Items",
      icon: CheckSquare,
      squircleBg: "bg-gradient-to-br from-[#30d158] to-[#00a843] shadow-[0_4px_16px_rgba(48,209,88,0.4)]",
      href: "/courses",
    },
    {
      label: isAr ? "الساعات المسجلة" : "Enrolled Credits",
      value: totalCredits,
      unit: isAr ? "ساعة" : "Credits",
      icon: GraduationCap,
      squircleBg: "bg-gradient-to-br from-[#bf5af2] to-[#8e44ad] shadow-[0_4px_16px_rgba(191,90,242,0.4)]",
      href: "/courses",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, squircleBg, href }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(
            "group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 min-h-[128px] backdrop-blur-xl shadow-lg overflow-hidden",
            "transition-all duration-300 ease-out",
            "hover:bg-white/[0.08] hover:border-blue-400/40 hover:shadow-[0_0_25px_rgba(47,123,255,0.18)] hover:-translate-y-0.5 active:scale-[0.99]"
          )}
        >
          {/* Subtle top hairline highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:via-blue-400/60 transition-colors" />

          <div className="flex items-center justify-between">
            {/* Apple Squircle Icon matching widgets above */}
            <div className={cn("h-10 w-10 sm:h-11 sm:w-11 rounded-2xl p-0.5 shadow-lg shrink-0 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105", squircleBg)}>
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="h-7 w-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-all">
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {unit}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1.5 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}