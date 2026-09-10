"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ChevronLeft, ChevronRight, BookOpen, Clock, FileText, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import type { Course } from "@/lib/types";

interface CoursesClientProps {
  enrolledCourses: Course[];
  totalCredits: number;
}

export function CoursesClient({ enrolledCourses, totalCredits }: CoursesClientProps) {
  const { t, isRtl, language } = useLanguage();
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const subtitleText = language === "en"
    ? `${enrolledCourses.length} enrolled courses · ${totalCredits} credit hours`
    : `${enrolledCourses.length} مواد مسجلة · ${totalCredits} ساعة معتمدة`;

  return (
    <>
      <PageHeader
        title={t.courses.title}
        subtitle={subtitleText}
      />

      <div className="px-4 py-5 space-y-4 max-w-5xl mx-auto">
        {enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3 text-foreground">
              <BookOpen className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-foreground">{t.courses.emptyTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {t.courses.emptyDesc}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-11 min-h-[44px] items-center justify-center px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all duration-150"
            >
              {t.courses.backHome}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => {
              const gradePercent = course.grade?.total;
              const pendingAssignments = course.assignments?.filter(
                (a) => a.status === "pending"
              ).length || 0;
              const courseDisplayName = language === "en" && course.nameEn ? course.nameEn : course.nameAr;

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 min-h-[120px] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/25"
                >
                  {/* Top: Header & Code */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="h-9 w-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: `${course.color || "currentColor"}18`,
                            color: course.color || "currentColor",
                          }}
                        >
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {courseDisplayName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {course.code} · {course.credits || 3} {t.courses.credits}
                          </p>
                        </div>
                      </div>

                      {gradePercent !== undefined ? (
                        <span className="text-xs font-semibold tabular-nums text-foreground bg-secondary px-2.5 py-1 rounded-md border border-border flex-shrink-0">
                          {gradePercent} / 100
                        </span>
                      ) : (
                        <ChevronIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      )}
                    </div>

                    {/* Middle info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[140px]">{course.instructor}</span>
                      </span>
                      {course.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{course.room}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Quick badges */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border text-xs">
                    <span className="text-muted-foreground">{course.semester}</span>
                    <div className="flex items-center gap-2">
                      {pendingAssignments > 0 ? (
                        <Badge variant="warning" className="gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{pendingAssignments} {t.courses.pendingTasks}</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{course.assignments?.length || 0} {t.dashboard.assignmentTypes.assignment}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
