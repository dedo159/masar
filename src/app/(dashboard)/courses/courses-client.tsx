"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ChevronLeft, ChevronRight, BookOpen, Clock, FileText, User, MapPin, CheckCircle2, Archive, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateInstructor, translateSemester, translateRoom } from "@/lib/translations/academic";
import type { Course } from "@/lib/types";

interface CoursesClientProps {
  enrolledCourses: Course[];
  allRegisteredCourses?: Course[];
  totalCredits: number;
}

export function CoursesClient({ enrolledCourses, allRegisteredCourses = [], totalCredits }: CoursesClientProps) {
  const { t, isRtl, language } = useLanguage();
  const isAr = language === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const displayList = enrolledCourses.length > 0 ? enrolledCourses : allRegisteredCourses;
  const subtitleText = isAr
    ? `${displayList.length} مواد دراسية مسجلة`
    : `${displayList.length} registered courses`;

  return (
    <>
      <PageHeader
        title={t.courses.title}
        subtitle={subtitleText}
      />

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        {/* When 0 courses (completely cleared/zeroed out) */}
        {displayList.length === 0 ? (
          <div className="apple-glass-card flex flex-col items-center justify-center py-16 px-4 text-center shadow-xl border-dashed">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isAr ? "انتهى الفصل الدراسي وتم تصفير المواد 🎉" : "Semester Ended & Courses Cleared 🎉"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md leading-relaxed font-normal">
              {isAr
                ? "لا توجد أي مواد مسجلة حالياً. تم تصفير مواد الفصل والمهام بنجاح. ستظهر المواد الجديدة فور بدء التسجيل للفصل القادم."
                : "No registered courses currently. All courses and assignments have been cleared. New courses will appear upon enrollment."}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center justify-center px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              {isAr ? "العودة للرئيسية" : "Back to Home"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <BookOpen className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {enrolledCourses.length > 0
                      ? (isAr ? "المواد المسجلة للفصل الحالي" : "Current Registered Courses")
                      : (isAr ? "سجل المواد المسجلة" : "Registered Courses Record")}
                  </h2>
                  <p className="text-xs text-slate-300 font-normal">
                    {isAr ? `${totalCredits} ساعة معتمدة إجمالية` : `${totalCredits} total credit hours`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-white/[0.06] text-blue-300 border border-white/12 px-3.5 py-1.5 rounded-full shadow-xs">
                {displayList.length} {isAr ? "مواد" : "courses"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayList.map((course) => {
                const gradePercent = course.grade?.total;
                const pendingAssignments = course.assignments?.filter(
                  (a) => a.status === "pending"
                ).length || 0;
                const courseDisplayName = translateCourseName(course.code, course.nameAr, course.nameEn, language);
                const instructorName = translateInstructor(course.instructor, language);
                const semesterName = translateSemester(course.semester, language);
                const isCompleted = course.status === "completed";

                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group relative flex flex-col justify-between apple-glass-card p-5 sm:p-6 shadow-xl hover:border-white/25 active:scale-[0.99] transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Top: Header & Code */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div
                            className="h-12 w-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-md text-white border border-white/20"
                            style={{
                              background: `linear-gradient(135deg, ${course.color || "#2F7BFF"} 0%, #1e3a8a 100%)`,
                            }}
                          >
                            <BookOpen className="h-6 w-6 fill-white/20" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-white group-hover:text-blue-300 truncate transition-colors tracking-tight">
                              {courseDisplayName}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 truncate font-medium">
                              {course.code} · {course.credits || 3} {t.courses.credits}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCompleted && (
                            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{isAr ? "مكتملة" : "Completed"}</span>
                            </span>
                          )}
                          {gradePercent !== undefined ? (
                            <span className="text-sm font-extrabold font-mono tabular-nums text-white bg-white/[0.06] border border-white/12 px-3 py-1 rounded-xl shadow-xs">
                              {gradePercent}
                              <span className="text-[11px] text-slate-400 ml-1">/ 100</span>
                            </span>
                          ) : (
                            <div className="h-8 w-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-white/[0.12] transition-colors">
                              <ChevronIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle info */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 mt-4 text-xs font-medium">
                        <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl text-slate-200">
                          <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{instructorName}</span>
                        </span>
                        {course.room && (
                          <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl text-slate-200">
                            <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span>{translateRoom(course.room, language)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Quick badges */}
                    <div className="relative z-10 flex items-center justify-between pt-3.5 mt-4 border-t border-white/10 text-xs font-medium">
                      <span className="text-slate-400">{semesterName}</span>
                      <div className="flex items-center gap-2">
                        {pendingAssignments > 0 ? (
                          <div className="flex items-center gap-1.5 text-rose-300 bg-rose-500/20 border border-rose-400/35 px-3 py-1 rounded-full shadow-xs font-bold">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{pendingAssignments} {t.courses.pendingTasks}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-300 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                            <FileText className="h-3.5 w-3.5 text-blue-400" />
                            <span>{course.assignments?.length || 0} {t.dashboard.assignmentTypes.assignment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}