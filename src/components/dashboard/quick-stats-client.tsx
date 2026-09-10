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
      iconColor: "text-foreground",
      iconBg: "bg-secondary",
      href: "/courses",
      highlight: false,
    },
    {
      label: t.dashboard.stats.todayDue,
      value: todayDueCount,
      unit: t.dashboard.stats.tasksUnit,
      icon: Clock,
      iconColor: todayDueCount > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400",
      iconBg: todayDueCount > 0 ? "bg-destructive/10" : "bg-emerald-500/10",
      href: "/courses",
      highlight: todayDueCount > 0,
    },
    {
      label: t.dashboard.stats.internships,
      value: internshipsCount,
      unit: t.dashboard.stats.internshipsUnit,
      icon: Briefcase,
      iconColor: "text-foreground",
      iconBg: "bg-secondary",
      href: "/internships",
      highlight: false,
    },
    {
      label: t.dashboard.stats.deals,
      value: dealsCount,
      unit: t.dashboard.stats.dealsUnit,
      icon: Tag,
      iconColor: "text-foreground",
      iconBg: "bg-secondary",
      href: "/deals",
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, iconColor, iconBg, href, highlight }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(
            "group relative flex flex-col justify-between rounded-xl border bg-card p-4 min-h-[96px]",
            "transition-all duration-200 ease-out shadow-xs",
            "hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/25",
            highlight ? "border-destructive/40 bg-destructive/[0.02]" : "border-border"
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105", iconBg)}>
              <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.75} />
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                {value}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
