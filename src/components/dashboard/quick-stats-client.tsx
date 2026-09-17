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
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.todayDue,
      value: todayDueCount,
      unit: t.dashboard.stats.tasksUnit,
      icon: Clock,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.internships,
      value: internshipsCount,
      unit: t.dashboard.stats.internshipsUnit,
      icon: Briefcase,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
      href: "/internships",
    },
    {
      label: t.dashboard.stats.deals,
      value: dealsCount,
      unit: t.dashboard.stats.dealsUnit,
      icon: Tag,
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-500/10",
      href: "/deals",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, iconColor, iconBg, href }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(
            "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 sm:p-5 min-h-[120px]",
            "shadow-xs transition-all duration-200 ease-out",
            "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm active:scale-[0.98]"
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105", iconBg, iconColor)}>
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="h-7 w-7 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {unit}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1.5 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}