import { getDegreeRequirements, getStudentProfile } from "@/lib/db-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorState } from "@/components/ui/error-state";
import type { DegreeRequirementCourse } from "@/lib/types";

export const revalidate = 60;

const categoryColors: Record<string, string> = {
  mandatory: "#6366F1",
  major: "#8B5CF6",
  university: "#06B6D4",
  elective: "#10B981",
};

const courseStatusConfig: Record<DegreeRequirementCourse["status"], {
  icon: typeof Circle;
  color: string;
  badge?: string;
}> = {
  completed: { icon: CheckCircle2, color: "text-emerald-500" },
  enrolled: { icon: BookOpen, color: "text-primary", badge: "مُسجَّل" },
  available: { icon: Circle, color: "text-muted-foreground" },
  locked: { icon: Lock, color: "text-muted-foreground" },
};

export default async function DegreePage() {
  let student = null;
  let requirements = [];

  try {
    const [st, reqs] = await Promise.all([
      getStudentProfile(),
      getDegreeRequirements(),
    ]);
    student = st;
    requirements = reqs;
  } catch (error) {
    console.error("DegreePage fetch error:", error);
    return (
      <>
        <PageHeader title="تقدّم التخرج" subtitle="خطأ في الاتصال" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="تعذر تحميل بيانات متطلبات التخرج من الخادم." />
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <PageHeader title="تقدّم التخرج" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="لم يتم العثور على سجل الطالب." />
        </div>
      </>
    );
  }

  const { totalCredits, completedCredits } = student;
  const overallPct = totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;

  return (
    <>
      <PageHeader
        title="تقدّم التخرج"
        subtitle={`${completedCredits} من ${totalCredits} ساعة مكتملة`}
      />
      <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto lg:max-w-none">

        {/* Overall ring */}
        <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-5">
          {/* SVG Ring */}
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--secondary)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - overallPct / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-medium tabular-nums">{overallPct}%</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-base font-medium">هندسة الحاسوب</p>
            <p className="text-xs text-muted-foreground mt-0.5">السنة الثالثة</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-lg font-medium tabular-nums">{completedCredits}</p>
                <p className="text-xs text-muted-foreground">ساعة مكتملة</p>
              </div>
              <div>
                <p className="text-lg font-medium tabular-nums">{totalCredits - completedCredits}</p>
                <p className="text-xs text-muted-foreground">ساعة متبقية</p>
              </div>
            </div>
          </div>
        </div>

        {/* Per category */}
        {requirements.map((req) => {
          const pct = Math.round((req.completedCredits / req.totalCredits) * 100);
          const color = categoryColors[req.category];

          return (
            <div key={req.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Category header */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium">{req.categoryLabel}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {req.completedCredits}/{req.totalCredits} ساعة
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" indicatorColor={color} />
              </div>

              {/* Course list */}
              <div className="divide-y divide-border">
                {req.courses.map((course) => {
                  const config = courseStatusConfig[course.status];
                  const Icon = config.icon;

                  return (
                    <div
                      key={course.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        course.status === "locked" && "opacity-50"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 flex-shrink-0", config.color)} strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{course.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{course.code}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {course.grade && (
                          <span className="text-xs font-medium text-emerald-500">{course.grade}</span>
                        )}
                        {config.badge && (
                          <Badge variant="default" className="text-[10px]">{config.badge}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground tabular-nums">{course.credits} س</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
