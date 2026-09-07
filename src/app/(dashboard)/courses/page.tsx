import Link from "next/link";
import { getEnrolledCourses } from "@/lib/db-queries";
import { PageHeader } from "@/components/layout/page-header";
import { getDayLabel, formatTime } from "@/lib/utils";
import { ChevronLeft, BookOpen } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let enrolledCourses = [];
  try {
    const courses = await getEnrolledCourses();
    enrolledCourses = courses.filter((c) => c.status === "enrolled");
  } catch (error) {
    console.error("CoursesPage data fetch error:", error);
    return (
      <>
        <PageHeader title="المواد" subtitle="حدث خطأ أثناء تحميل المواد" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="تعذر جلب قائمة المواد من قاعدة البيانات. يرجى إعادة المحاولة لاحقاً." />
        </div>
      </>
    );
  }

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <>
      <PageHeader
        title="المواد"
        subtitle={`${enrolledCourses.length} مواد · ${totalCredits} ساعة معتمدة`}
      />
      <div className="px-4 py-4 space-y-2 max-w-2xl mx-auto lg:max-w-none">
        {enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50 text-center">
            <div className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-3">
              <BookOpen className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">لا توجد مواد مسجلة حالياً</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              لم يتم رصد أي مقررات دراسية مسجلة لهذا الفصل الدراسي حتى الآن.
            </p>
          </div>
        ) : (
          enrolledCourses.map((course) => {
            const firstLecture = course.schedule.find((s) => s.type === "lecture");
            const gradePercent = course.grade?.total;

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-secondary/50 transition-all duration-150 group"
              >
                {/* Color strip */}
                <div
                  className="h-10 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: course.color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{course.nameAr}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {course.code} · {course.instructor}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {gradePercent !== undefined && (
                        <span className="text-xs font-medium tabular-nums text-foreground bg-secondary/60 px-2 py-0.5 rounded border border-border">
                          {gradePercent} / 100
                        </span>
                      )}
                      <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {course.credits} ساعات
                    </span>
                    {firstLecture && (
                      <span className="text-xs text-muted-foreground">
                        {getDayLabel(firstLecture.day)} {formatTime(firstLecture.startTime)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {course.room}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
