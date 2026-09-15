"use client";

import Link from "next/link";
import { BookOpen, Briefcase, Clock, Tag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

interface QuickStatsClientProps {
  coursesCount: number;
  todayDueCount: number;
  internshipsCount: number;
  dealsCount: number;
}

export function QuickStatsClient({
  coursesCount,
  todayDueCount,
  internshipsCount,
  dealsCount,
}: QuickStatsClientProps) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t.dashboard.stats.enrolledCourses,
      value: coursesCount,
      unit: t.dashboard.stats.coursesUnit,
      icon: BookOpen,
      gradient: "fintech-gradient-blue",
      glow: "hover:fintech-glow-blue",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.todayDue,
      value: todayDueCount,
      unit: t.dashboard.stats.tasksUnit,
      icon: Clock,
      gradient: "fintech-gradient-purple",
      glow: "hover:fintech-glow-purple",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.internships,
      value: internshipsCount,
      unit: t.dashboard.stats.internshipsUnit,
      icon: Briefcase,
      gradient: "fintech-gradient-teal",
      glow: "hover:fintech-glow-teal",
      href: "/internships",
    },
    {
      label: t.dashboard.stats.deals,
      value: dealsCount,
      unit: t.dashboard.stats.dealsUnit,
      icon: Tag,
      gradient: "fintech-gradient-orange",
      glow: "hover:fintech-glow-orange",
      href: "/deals",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, gradient, glow, href }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(
            "group relative flex flex-col justify-between rounded-[20px] border border-white/5 bg-card p-5 min-h-[120px]",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:border-white/20 active:scale-[0.98]",
            glow
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg text-white", gradient)}>
              <Icon className="h-5 w-5 fill-white/20" strokeWidth={2} />
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowUpRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs font-semibold text-white/50">
                {unit}
              </span>
            </div>
            <p className="text-sm font-medium text-white/70 mt-2 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}