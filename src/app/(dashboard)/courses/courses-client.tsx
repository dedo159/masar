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

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        {enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-center">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <BookOpen className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === "en" ? "Semester Completed 🎉" : "انتهى الفصل الدراسي الحالي 🎉"}
            </h3>
            <p className="text-xs text-white/50 mt-1.5 max-w-md leading-relaxed">
              {language === "en"
                ? "Current semester courses have been archived. Best of luck on your final exams and enjoy your break! New semester courses will appear upon enrollment."
                : "تمت أرشفة مواد الفصل الحالي مع انطلاق الامتحانات النهائية. نتمنى لك التوفيق وإجازة سعيدة! ستظهر مواد الفصل الجديد فور تسجيلها وبدء دوامها."}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-xl bg-gradient-to-r from-[#2F7BFF] to-[#E83D84] text-white text-xs font-bold hover:opacity-95 shadow-[0_0_20px_rgba(47,123,255,0.3)] transition-all duration-300"
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
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#2F7BFF]/40 hover:bg-white/[0.06] overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#2F7BFF]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top: Header & Code */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="h-11 w-11 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(47,123,255,0.25)] text-white border border-white/20"
                          style={{
                            background: `linear-gradient(135deg, ${course.color || "#2F7BFF"} 0%, ${course.color || "#8B5CF6"}99 100%)`,
                          }}
                        >
                          <BookOpen className="h-5 w-5 fill-white/20" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white group-hover:text-[#38BDF8] truncate transition-colors">
                            {courseDisplayName}
                          </h3>
                          <p className="text-xs text-white/50 mt-1 truncate font-medium">
                            {course.code} · {course.credits || 3} {t.courses.credits}
                          </p>
                        </div>
                      </div>

                      {gradePercent !== undefined ? (
                        <span className="text-sm font-extrabold font-mono tabular-nums text-white bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-xl flex-shrink-0">
                          {gradePercent}
                          <span className="text-[10px] text-white/40 ml-0.5">/ 100</span>
                        </span>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <ChevronIcon className="h-4 w-4 text-white/60 group-hover:text-white" />
                        </div>
                      )}
                    </div>

                    {/* Middle info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 text-[11px] text-white/70 font-medium">
                      <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                        <User className="h-3.5 w-3.5 text-[#38BDF8]" />
                        <span className="truncate max-w-[140px]">{instructorName}</span>
                      </span>
                      {course.room && (
                        <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                          <MapPin className="h-3.5 w-3.5 text-[#E83D84]" />
                          <span>{translateRoom(course.room, language)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Quick badges */}
                  <div className="relative z-10 flex items-center justify-between pt-3.5 mt-4 border-t border-white/[0.08] text-[11px] font-medium">
                    <span className="text-white/40">{semesterName}</span>
                    <div className="flex items-center gap-2">
                      {pendingAssignments > 0 ? (
                        <div className="flex items-center gap-1.5 text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-full shadow-sm font-bold">
                          <Clock className="h-3 w-3" />
                          <span>{pendingAssignments} {t.courses.pendingTasks}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-white/60 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">
                          <FileText className="h-3 w-3 text-[#38BDF8]" />
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