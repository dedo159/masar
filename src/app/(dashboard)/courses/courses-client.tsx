"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ChevronLeft, ChevronRight, BookOpen, Clock, FileText, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateInstructor, translateSemester, translateRoom } from "@/lib/translations/academic";
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
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-dashed border-border bg-card/60 text-center">
            <div className="h-14 w-14 rounded-lg bg-[#0a72ef] text-white flex items-center justify-center mb-3 text-foreground shadow-lg">
              <BookOpen className="h-6 w-6 fill-white/20" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-foreground">{t.courses.emptyTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {t.courses.emptyDesc}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-lg bg-[#0a72ef] text-white text-foreground text-xs font-bold hover:bg-[#0070f3] transition-all duration-300"
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
              const courseDisplayName = translateCourseName(course.code, course.nameAr, course.nameEn, language);
              const instructorName = translateInstructor(course.instructor, language);
              const semesterName = translateSemester(course.semester, language);

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-4 min-h-[120px] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border/50 hover:bg-white/[0.03]"
                >
                  {/* Top: Header & Code */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="h-11 w-11 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-md text-foreground"
                          style={{
                            background: `linear-gradient(135deg, ${course.color || "#0070f3"} 0%, ${course.color || "#8B5CF6"}99 100%)`,
                          }}
                        >
                          <BookOpen className="h-5 w-5 fill-white/20" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-foreground truncate transition-colors">
                            {courseDisplayName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                            {course.code} · {course.credits || 3} {t.courses.credits}
                          </p>
                        </div>
                      </div>

                      {gradePercent !== undefined ? (
                        <span className="text-sm font-extrabold tabular-nums text-foreground bg-muted px-2.5 py-1 rounded-lg border border-border flex-shrink-0">
                          {gradePercent}
                          <span className="text-[10px] text-muted-foreground ml-0.5">/ 100</span>
                        </span>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-muted transition-colors">
                          <ChevronIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Middle info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-[11px] text-muted-foreground/80 font-medium">
                      <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-md">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[140px]">{instructorName}</span>
                      </span>
                      {course.room && (
                        <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-md">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{translateRoom(course.room, language)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Quick badges */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border text-[11px] font-medium">
                    <span className="text-muted-foreground/60">{semesterName}</span>
                    <div className="flex items-center gap-2">
                      {pendingAssignments > 0 ? (
                        <div className="flex items-center gap-1.5 text-foreground bg-[#ff5b4f] px-2.5 py-1 rounded-full shadow-md font-bold">
                          <Clock className="h-3 w-3" />
                          <span>{pendingAssignments} {t.courses.pendingTasks}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground/80 bg-secondary border border-border px-2.5 py-1 rounded-full">
                          <FileText className="h-3 w-3" />
                          <span>{course.assignments?.length || 0} {t.dashboard.assignmentTypes.assignment}</span>
                        </div>
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