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
  const subtitleText = enrolledCourses.length > 0
    ? (isAr ? `${enrolledCourses.length} مواد دراسية نشطة حالياً` : `${enrolledCourses.length} active courses`)
    : (isAr ? `${allRegisteredCourses.length} مواد مسجلة في سجلك الأكاديمي` : `${allRegisteredCourses.length} registered courses in your academic record`);

  return (
    <>
      <PageHeader
        title={t.courses.title}
        subtitle={subtitleText}
      />

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        {/* Semester Completed Banner when active enrolled courses is 0 */}
        {enrolledCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-border/80 dark:border-white/10 bg-card/60 dark:bg-white/[0.03] backdrop-blur-xl text-center shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {isAr ? "انتهى الفصل الدراسي الحالي 🎉" : "Semester Completed 🎉"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed font-medium">
              {isAr
                ? "تمت أرشفة مواد الفصل الحالي وتصفير المهام بنجاح مع انطلاق العطلة. نتمنى لك التوفيق وإجازة سعيدة! يمكنك أدناه استعراض كافة المواد المسجلة ومحتوياتها."
                : "Current semester courses and assignments have concluded. Best of luck and enjoy your break! You can browse your full record of registered courses below."}
            </p>
          </div>
        )}

        {/* Registered Courses Record Section */}
        {displayList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#2F7BFF]/10 text-[#2F7BFF] dark:text-[#38BDF8] border border-[#2F7BFF]/20">
                  <BookOpen className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {enrolledCourses.length > 0
                      ? (isAr ? "المواد المسجلة للفصل الحالي" : "Current Registered Courses")
                      : (isAr ? "سجل المواد المسجلة" : "Registered Courses Record")}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {isAr ? `${totalCredits} ساعة معتمدة إجمالية` : `${totalCredits} total credit hours`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-muted dark:bg-white/[0.06] text-foreground px-3 py-1 rounded-full border border-border/60">
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
                    className="group relative flex flex-col justify-between rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-5 shadow-sm dark:shadow-xl backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#2F7BFF]/40 overflow-hidden"
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
                            <h3 className="text-sm font-bold text-foreground group-hover:text-[#2F7BFF] dark:group-hover:text-[#38BDF8] truncate transition-colors">
                              {courseDisplayName}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                              {course.code} · {course.credits || 3} {t.courses.credits}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {isAr ? "مكتملة" : "Completed"}
                            </span>
                          )}
                          {gradePercent !== undefined ? (
                            <span className="text-sm font-extrabold font-mono tabular-nums text-foreground bg-muted/60 dark:bg-white/[0.06] border border-border dark:border-white/10 px-2.5 py-1 rounded-xl">
                              {gradePercent}
                              <span className="text-[10px] text-muted-foreground ml-0.5">/ 100</span>
                            </span>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted/50 dark:bg-white/[0.05] border border-border dark:border-white/10 flex items-center justify-center group-hover:bg-muted dark:group-hover:bg-white/10 transition-colors">
                              <ChevronIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle info */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 text-[11px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5 bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/[0.08] px-2.5 py-1 rounded-lg">
                          <User className="h-3.5 w-3.5 text-[#2F7BFF] dark:text-[#38BDF8]" />
                          <span className="truncate max-w-[140px]">{instructorName}</span>
                        </span>
                        {course.room && (
                          <span className="flex items-center gap-1.5 bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/[0.08] px-2.5 py-1 rounded-lg">
                            <MapPin className="h-3.5 w-3.5 text-[#E83D84]" />
                            <span>{translateRoom(course.room, language)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Quick badges */}
                    <div className="relative z-10 flex items-center justify-between pt-3.5 mt-4 border-t border-border/60 dark:border-white/[0.08] text-[11px] font-medium">
                      <span className="text-muted-foreground">{semesterName}</span>
                      <div className="flex items-center gap-2">
                        {pendingAssignments > 0 ? (
                          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 px-2.5 py-1 rounded-full shadow-sm font-bold">
                            <Clock className="h-3 w-3" />
                            <span>{pendingAssignments} {t.courses.pendingTasks}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/[0.08] px-2.5 py-1 rounded-full">
                            <FileText className="h-3 w-3 text-[#2F7BFF] dark:text-[#38BDF8]" />
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