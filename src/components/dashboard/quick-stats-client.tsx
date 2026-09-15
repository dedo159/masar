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
      iconColor: "text-academic-fg",
      iconBg: "bg-academic-bg",
      cardClass: "hover:border-academic-fg/30 hover:shadow-academic-bg/50",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.todayDue,
      value: todayDueCount,
      unit: t.dashboard.stats.tasksUnit,
      icon: Clock,
      iconColor: "text-progress-fg",
      iconBg: "bg-progress-bg",
      cardClass: "hover:border-progress-fg/30 hover:shadow-progress-bg/50",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.internships,
      value: internshipsCount,
      unit: t.dashboard.stats.internshipsUnit,
      icon: Briefcase,
      iconColor: "text-career-fg",
      iconBg: "bg-career-bg",
      cardClass: "hover:border-career-fg/30 hover:shadow-career-bg/50",
      href: "/internships",
    },
    {
      label: t.dashboard.stats.deals,
      value: dealsCount,
      unit: t.dashboard.stats.dealsUnit,
      icon: Tag,
      iconColor: "text-deals-fg",
      iconBg: "bg-deals-bg",
      cardClass: "hover:border-deals-fg/30 hover:shadow-deals-bg/50",
      href: "/deals",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, iconColor, iconBg, cardClass, href }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(
            "group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 min-h-[110px]",
            "transition-all duration-300 ease-out shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
            "hover:-translate-y-1 hover:shadow-md active:scale-[0.98]",
            cardClass
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105", iconBg)}>
              <Icon className={cn("h-5 w-5", iconColor)} strokeWidth={1.5} />
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {unit}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-2 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}