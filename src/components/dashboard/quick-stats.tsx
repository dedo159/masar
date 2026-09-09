import { getEnrolledCourses, getTodayClasses } from "@/lib/db-queries";
import { BookOpen, Calendar, FileText, CheckCircle2 } from "lucide-react";

export async function QuickStatsSection() {
  const [courses, todayClasses] = await Promise.all([
    getEnrolledCourses(),
    getTodayClasses(),
  ]);

  const totalAssignments = courses.reduce(
    (acc, c) => acc + (c.assignments?.length || 0),
    0
  );

  const stats = [
    {
      label: "المساقات المسجلة",
      value: courses.length,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "إجمالي التكليفات",
      value: totalAssignments,
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
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
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
        >
          <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xl font-medium tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
