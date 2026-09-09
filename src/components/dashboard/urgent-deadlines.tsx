import Link from "next/link";
import { getEnrolledCourses } from "@/lib/db-queries";
import { getDeadlineStatus, getRelativeTime } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowLeft, CheckCircle2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Assignment, Course } from "@/lib/types";

const typeLabel: Record<Assignment["type"], string> = {
  assignment: "واجب",
  quiz: "اختبار قصير",
  project: "مشروع",
  exam: "امتحان",
};

export async function UrgentDeadlinesSection() {
  let courses: Course[] = [];
  try {
    courses = await getEnrolledCourses();
  } catch (error) {
    console.error("UrgentDeadlinesSection fetch error:", error);
    courses = [];
  }

  const upcoming = courses
    .flatMap((c) =>
      c.assignments
        .filter((a) => a.status === "pending")
        .map((a) => ({ ...a, courseNameAr: c.nameAr, courseId: c.id, courseColor: c.color }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const urgentCount = upcoming.filter(
    (a) => getDeadlineStatus(a.dueDate, a.dueTime) === "urgent"
  ).length;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            المواعيد والتسليمات القادمة
          </h2>
          {urgentCount > 0 && (
            <Badge variant="urgent" className="gap-1 animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              <span>{urgentCount} عاجل</span>
            </Badge>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <span>كل المواد</span>
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      {/* Empty State vs List */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">لا توجد تسليمات عاجلة حالياً 🎉</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            أنت على المسار الصحيح تماماً! راجع موادك أو استغل الوقت لتحضير المحاضرات القادمة.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((assignment) => {
            const status = getDeadlineStatus(assignment.dueDate, assignment.dueTime);
            const relTime = getRelativeTime(assignment.dueDate, assignment.dueTime);

            return (
              <Link
                key={assignment.id}
                href={`/courses/${assignment.courseId}`}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 min-h-[52px]",
                  "hover:border-foreground/20 hover:bg-secondary/40 hover:-translate-y-0.5 shadow-xs",
                  "transition-all duration-150 ease-out group"
                )}
              >
                {/* Course color indicator */}
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: assignment.courseColor || "currentColor" }}
                />

                {/* Assignment Title & Course Info (Truncated safely) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {assignment.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {assignment.courseNameAr} · {typeLabel[assignment.type] || "واجب"}
                  </p>
                </div>

                {/* Status Badge & Due Time */}
                <div className="flex-shrink-0 text-left flex flex-col items-end gap-1">
                  {status === "urgent" ? (
                    <Badge variant="urgent" className="gap-1">
                      <Clock className="h-3 w-3" />
                      <span>عاجل: {relTime}</span>
                    </Badge>
                  ) : status === "soon" ? (
                    <Badge variant="warning" className="gap-1">
                      <Clock className="h-3 w-3" />
                      <span>قريباً: {relTime}</span>
                    </Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{relTime}</span>
                    </span>
                  )}

                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      الساعة {assignment.dueTime}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
