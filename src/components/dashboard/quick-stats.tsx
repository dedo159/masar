import Link from "next/link";
import { getEnrolledCourses, getTodayClasses, getInternships } from "@/lib/db-queries";
import { BookOpen, Calendar, Briefcase, CheckCircle2 } from "lucide-react";

export async function QuickStatsSection() {
  const [courses, todayClasses, internships] = await Promise.all([
    getEnrolledCourses(),
    getTodayClasses(),
    getInternships(),
  ]);

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
      label: "فرص التدريب المتاحة",
      value: internships.length,
      icon: Briefcase,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/internships",
    },
    {
      label: "محاضرات اليوم",
      value: todayClasses.length,
      icon: Calendar,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "بوابة Moodle",
      value: "متصل",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
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
