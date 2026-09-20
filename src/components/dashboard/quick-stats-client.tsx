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
      iconStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.todayDue,
      value: todayDueCount,
      unit: t.dashboard.stats.tasksUnit,
      icon: Clock,
      iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      href: "/courses",
    },
    {
      label: isAr ? "الواجبات والاختبارات" : "Tasks & Exams",
      value: totalAssignmentsCount,
      unit: isAr ? "تكليف" : "Items",
      icon: CheckSquare,
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      href: "/courses",
    },
    {
      label: isAr ? "الساعات المسجلة" : "Enrolled Credits",
      value: totalCredits,
      unit: isAr ? "ساعة" : "Credits",
      icon: GraduationCap,
      iconStyle: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      href: "/courses",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, iconStyle, href }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(
            "group relative flex flex-col justify-between rounded-2xl border border-border/80 dark:border-white/[0.08] bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.01] p-4 sm:p-5 min-h-[128px] backdrop-blur-xl shadow-sm dark:shadow-xl overflow-hidden",
            "transition-all duration-300 ease-out",
            "hover:border-[#2F7BFF]/50 hover:shadow-[0_0_25px_rgba(47,123,255,0.18)] hover:-translate-y-0.5 active:scale-[0.99]"
          )}
        >
          {/* Subtle top hairline highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent group-hover:via-[#2F7BFF]/60 transition-colors" />

          <div className="flex items-center justify-between">
            <div className={cn("h-10 w-10 sm:h-11 sm:w-11 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm", iconStyle)}>
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div className="h-7 w-7 rounded-full bg-muted/80 dark:bg-white/[0.06] flex items-center justify-center group-hover:bg-[#2F7BFF]/20 transition-all">
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#2F7BFF] dark:group-hover:text-[#38BDF8] transition-colors" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {unit}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1.5 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}