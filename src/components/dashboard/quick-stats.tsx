import Link from "next/link";
import { getEnrolledCourses, getInternships } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";
import { BookOpen, Briefcase, Clock, Tag } from "lucide-react";

export async function QuickStatsSection() {
  const [courses, internships, dealsCount] = await Promise.all([
    getEnrolledCourses(),
    getInternships(),
    prisma.merchantDeal.count({
      where: {
        isActive: true,
        validUntil: { gte: new Date() },
      },
    }),
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
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/courses",
    },
    {
      label: "واجبات تسليم اليوم",
      value: todayDueAssignmentsCount,
      icon: Clock,
      color: todayDueAssignmentsCount > 0 ? "text-rose-500" : "text-emerald-500",
      bg: todayDueAssignmentsCount > 0 ? "bg-rose-500/10" : "bg-emerald-500/10",
      href: "/courses",
    },
    {
      label: "فرص التدريب المتاحة",
      value: internships.length,
      icon: Briefcase,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/internships",
    },
    {
      label: "العروض والخصومات",
      value: dealsCount,
      icon: Tag,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      href: "/deals",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color, bg, href }) => {
        const cardInner = (
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all h-full">
            <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-medium tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        );

        return href ? (
          <Link key={label} href={href} className="block group">
            {cardInner}
          </Link>
        ) : (
          <div key={label}>{cardInner}</div>
        );
      })}
    </div>
  );
}
