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
      gradient: "bg-[#171717] dark:bg-white text-white dark:text-black",
      glow: "hover:bg-[#383838] dark:hover:bg-[#e0e0e0]",
      href: "/courses",
    },
    {
      label: t.dashboard.stats.internships,
      value: internshipsCount,
      unit: t.dashboard.stats.internshipsUnit,
      icon: Briefcase,
      gradient: "vercel-button-primary",
      glow: "hover:bg-[#383838]",
      href: "/internships",
    },
    {
      label: t.dashboard.stats.deals,
      value: dealsCount,
      unit: t.dashboard.stats.dealsUnit,
      icon: Tag,
      gradient: "bg-[#ff5b4f] text-white",
      glow: "hover:bg-[#e04337]",
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
            "group relative flex flex-col justify-between vercel-card p-5 min-h-[120px]",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:border-border/50 active:scale-[0.98]",
            glow
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg text-foreground", gradient)}>
              <Icon className="h-5 w-5 fill-white/20" strokeWidth={2} />
            </div>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-muted transition-colors">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {unit}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground/90 mt-2 truncate">
              {label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}