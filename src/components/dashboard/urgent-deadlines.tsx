import Link from "next/link";
import { getEnrolledCourses } from "@/lib/db-queries";
import { getDeadlineStatus, getRelativeTime } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
    (a) => getDeadlineStatus(a.dueDate) === "urgent"
  ).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">المواعيد والتسليمات القادمة</h2>
          {urgentCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="h-3 w-3" />
              {urgentCount} عاجل
            </span>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          كل المواد
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-6 rounded-xl border border-dashed border-border bg-card/50 text-center">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <p className="text-xs text-muted-foreground">لا توجد تسليمات متأخرة أو قادمة خلال الفترة الحالية</p>
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
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 hover:border-border/80 hover:bg-secondary/50 transition-all duration-150 group"
              >
                {/* Course color dot */}
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: assignment.courseColor }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {assignment.courseNameAr} · {typeLabel[assignment.type]}
                  </p>
                </div>

                <div className="flex-shrink-0 text-left">
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      status === "urgent" && "text-destructive",
                      status === "soon" && "text-amber-500",
                      status === "normal" && "text-muted-foreground"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {relTime}
                  </div>
                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <p className="text-[11px] text-muted-foreground tabular-nums text-left mt-0.5">
                      الساعة {assignment.dueTime}
                    </p>
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
