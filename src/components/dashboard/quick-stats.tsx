import Link from "next/link";
import { getEnrolledCourses, getInternships } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";
import { BookOpen, Briefcase, Clock, Tag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export async function QuickStatsSection() {
  const [courses, internships, dealsCount] = await Promise.all([
    getEnrolledCourses().catch(() => []),
    getInternships().catch(() => []),
    prisma.merchantDeal.count({
      where: {
        isActive: true,
        validUntil: { gte: new Date() },
      },
    }).catch(() => 0),
  ]);

  const now = new Date();
  const todayDateString = now.toDateString();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const todayDueAssignmentsCount = courses
    .flatMap((c) => c.assignments || [])
    .filter((a) => {
      if (a.status === "submitted" || a.status === "graded") return false;
      if (!a.dueDate) return false;
      if (a.dueDate.startsWith(todayStr)) return true;
      try {
        return new Date(a.dueDate).toDateString() === todayDateString;
      } catch {
        return false;
      }
    }).length;

  const stats = [
    {
      label: "المساقات المسجلة",
      value: courses.length,
      unit: "مواد",
      icon: BookOpen,
      iconColor: "text-foreground",
      iconBg: "bg-secondary",
      href: "/courses",
      highlight: false,
    },
    {
      label: "تسليمات اليوم",
      value: todayDueAssignmentsCount,
      unit: "مهمات",
      icon: Clock,
      iconColor: todayDueAssignmentsCount > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400",
      iconBg: todayDueAssignmentsCount > 0 ? "bg-destructive/10" : "bg-emerald-500/10",
      href: "/courses",
      highlight: todayDueAssignmentsCount > 0,
    },
    {
      label: "فرص التدريب",
      value: internships.length,
      unit: "فرصة",
      icon: Briefcase,
      iconColor: "text-foreground",
      iconBg: "bg-secondary",
      href: "/internships",
      highlight: false,
    },
    {
      label: "العروض الطلابية",
      value: dealsCount,
      unit: "خصم",
      icon: Tag,
      iconColor: "text-foreground",
      iconBg: "bg-secondary",
      href: "/deals",
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, unit, icon: Icon, iconColor, iconBg, href, highlight }) => {
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border bg-card p-4 min-h-[96px]",
              "transition-all duration-200 ease-out shadow-xs",
              "hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/25",
              highlight ? "border-destructive/40 bg-destructive/[0.02]" : "border-border"
            )}
          >
            {/* Top row: Icon and mini arrow */}
            <div className="flex items-center justify-between">
              <div className={`h-8 w-8 rounded-lg ${iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={1.75} />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
            </div>

            {/* Bottom row: Value & label */}
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
        );
      })}
    </div>
  );
}
