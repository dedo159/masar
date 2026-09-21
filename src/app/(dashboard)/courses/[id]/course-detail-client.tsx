"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getDeadlineStatus, getRelativeTime, formatTime, cn } from "@/lib/utils";
import {
  Clock,
  BookOpen,
  FileText,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  Circle,
  FileIcon,
  Presentation,
  FolderOpen,
  ClipboardList,
  GraduationCap,
  Calendar,
  MapPin,
  User,
  FlaskConical,
} from "lucide-react";
import {
  translateCourseName,
  translateInstructor,
  translateSemester,
  translateAssignmentTitle,
  translateRoom,
  translateAssignmentDescription,
} from "@/lib/translations/academic";
import type { Course, Assignment, CourseFile, CourseGrade } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

interface CourseDetailClientProps {
  course: Course & {
    assignments: Assignment[];
    files: CourseFile[];
    grade?: CourseGrade | null;
  };
}

const fileIconMap: Record<CourseFile["type"], typeof FileText> = {
  pdf: FileText,
  pptx: Presentation,
  docx: FileIcon,
  zip: FileIcon,
  link: LinkIcon,
};

function EmptyStateCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FolderOpen;
  title: string;
  description: string;
}) {
  return (
    <div className="apple-glass-card flex flex-col items-center justify-center py-14 px-4 rounded-2xl text-center border-dashed shadow-xl">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-3.5 shadow-lg">
        <Icon className="h-6 w-6 fill-white/20" strokeWidth={2} />
      </div>
      <p className="text-base font-bold text-white mb-1">{title}</p>
      <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed font-normal">{description}</p>
    </div>
  );
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { t, language, isRtl } = useLanguage();
  const isAr = language === "ar";

  const displayName = translateCourseName(course.code, course.nameAr, course.nameEn, language);
  const subName = isAr
    ? translateCourseName(course.code, course.nameAr, course.nameEn, "en")
    : translateCourseName(course.code, course.nameAr, course.nameEn, "ar");
  const instructorName = translateInstructor(course.instructor, language);
  const semesterName = translateSemester(course.semester, language);

  const dayNames: Record<string, string> = {
    sun: t.courseDetail.dayNames.sun,
    mon: t.courseDetail.dayNames.mon,
    tue: t.courseDetail.dayNames.tue,
    wed: t.courseDetail.dayNames.wed,
    thu: t.courseDetail.dayNames.thu,
    fri: t.courseDetail.dayNames.fri,
    sat: t.courseDetail.dayNames.sat,
  };

  const typeLabel: Record<Assignment["type"], string> = {
    assignment: t.courseDetail.assignmentTypes.assignment,
    quiz: t.courseDetail.assignmentTypes.quiz,
    project: t.courseDetail.assignmentTypes.project,
    exam: t.courseDetail.assignmentTypes.exam,
  };

  const statusConfig: Record<
    Assignment["status"],
    { label: string; bg: string; text: string }
  > = {
    pending: { label: t.courseDetail.assignmentStatus.pending, bg: "bg-rose-500/20 border-rose-400/35", text: "text-rose-300" },
    submitted: { label: t.courseDetail.assignmentStatus.submitted, bg: "bg-blue-500/20 border-blue-400/35", text: "text-blue-300" },
    graded: { label: t.courseDetail.assignmentStatus.graded, bg: "bg-emerald-500/20 border-emerald-400/35", text: "text-emerald-300" },
    late: { label: t.courseDetail.assignmentStatus.late, bg: "bg-rose-500/20 border-rose-400/35", text: "text-rose-300" },
  };

  const hasGrades =
    course.grade &&
    (course.grade.midterm !== undefined ||
      course.grade.final !== undefined ||
      course.grade.assignments !== undefined ||
      course.grade.participation !== undefined ||
      course.grade.total !== undefined);

  return (
    <>
      <PageHeader
        title={displayName}
        subtitle={`${course.code} · ${instructorName}`}
      />

      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6 md:py-6 space-y-6">
        {/* Course Header Hero Card */}
        <div className="apple-glass-card p-6 shadow-xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div
              className="h-14 w-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${course.color || "#2F7BFF"} 0%, #1e3a8a 100%)`,
              }}
            >
              <BookOpen className="h-7 w-7 fill-white/20" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                    {displayName}
                  </h2>
                  {subName && <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{subName}</p>}
                </div>

                {course.grade?.total !== undefined && (
                  <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white/[0.06] px-3.5 py-1.5 rounded-xl border border-white/12 shadow-sm">
                    <span className="text-xs text-slate-300 font-semibold">{t.courseDetail.totalGrade}:</span>
                    <span className="text-base font-extrabold tabular-nums text-white">
                      {course.grade.total} <span className="text-xs text-slate-400">/ 100</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-white/10 text-xs text-slate-200 font-medium">
                <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl">
                  <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>{t.courseDetail.instructor}: {instructorName}</span>
                </span>
                {course.room && (
                  <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{t.courseDetail.room}: {translateRoom(course.room, language)}</span>
                  </span>
                )}
                <span className="bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl">
                  {course.credits || 3} {t.courseDetail.creditHours}
                </span>
                <span className="bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl text-slate-300">
                  {semesterName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Clean Tabs */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto p-1.5 gap-1.5 apple-glass-card rounded-2xl border-white/10">
            <TabsTrigger 
              value="schedule" 
              className="min-h-[42px] text-xs font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {t.courseDetail.scheduleTab}
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="min-h-[42px] text-xs font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {t.courseDetail.assignmentsTab} ({course.assignments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              className="min-h-[42px] text-xs font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {t.courseDetail.filesTab} ({course.files.length})
            </TabsTrigger>
            <TabsTrigger 
              value="grades" 
              className="min-h-[42px] text-xs font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {t.courseDetail.gradesTab}
            </TabsTrigger>
          </TabsList>

          {/* 1. Schedule Tab */}
          <TabsContent value="schedule" className="space-y-3">
            {!course.schedule || course.schedule.length === 0 ? (
              <EmptyStateCard
                icon={Calendar}
                title={t.courseDetail.emptyScheduleTitle}
                description={t.courseDetail.emptyScheduleDesc}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {course.schedule.map((slot, index) => {
                  const dayName = dayNames[slot.day.toLowerCase()] || slot.day;
                  const isLab = slot.type === "lab";

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3.5 rounded-2xl apple-glass-card p-4 sm:p-5 shadow-lg hover:border-white/20 transition-all"
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md text-white",
                        isLab ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      )}>
                        {isLab ? (
                          <FlaskConical className="h-5 w-5 fill-white/20" strokeWidth={2} />
                        ) : (
                          <BookOpen className="h-5 w-5 fill-white/20" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white">{dayName}</p>
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs", 
                            isLab 
                              ? "bg-amber-500/20 text-amber-300 border-amber-400/30" 
                              : "bg-blue-500/20 text-blue-300 border-blue-400/30"
                          )}>
                            {isLab ? t.courseDetail.classTypes.lab : t.courseDetail.classTypes.lecture}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 tabular-nums flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span>
                            {formatTime(slot.startTime, language)} - {formatTime(slot.endTime, language)}
                          </span>
                        </p>
                        <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span>{translateRoom(course.room, language) || t.courseDetail.defaultRoom}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 2. Assignments Tab */}
          <TabsContent value="assignments" className="space-y-3">
            {course.assignments.length === 0 ? (
              <EmptyStateCard
                icon={ClipboardList}
                title={t.courseDetail.emptyAssignmentsTitle}
                description={t.courseDetail.emptyAssignmentsDesc}
              />
            ) : (
              <div className="space-y-3">
                {course.assignments.map((assignment) => {
                  const statusInfo = statusConfig[assignment.status];
                  const dStatus = getDeadlineStatus(assignment.dueDate, assignment.dueTime);
                  const isUrgent = dStatus === "urgent" && assignment.status === "pending";
                  const relTime = getRelativeTime(assignment.dueDate, assignment.dueTime, language === "en" ? "en" : "ar");
                  const title = translateAssignmentTitle(assignment.title, language);
                  const desc = translateAssignmentDescription(assignment.description, language);

                  return (
                    <div
                      key={assignment.id}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl apple-glass-card p-5 shadow-lg hover:border-white/25 transition-all relative overflow-hidden",
                        isUrgent && "border-rose-400/40"
                      )}
                    >
                      {isUrgent && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
                      )}

                      <div className="flex-1 min-w-0 z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="text-base font-bold text-white tracking-tight truncate">
                            {title}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-300 bg-white/[0.06] border border-white/10 px-2.5 py-0.5 rounded-full">
                            {typeLabel[assignment.type] || assignment.type}
                          </span>
                        </div>
                        {desc && (
                          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1 leading-relaxed font-normal">
                            {desc}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium tabular-nums">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-blue-400" />
                            {assignment.dueDate}
                          </span>
                          {assignment.dueTime && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-blue-400" />
                              {assignment.dueTime}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={cn("flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 flex-shrink-0 z-10 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-white/10", isRtl ? "sm:text-left" : "sm:text-right")}>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-xs", statusInfo.bg, statusInfo.text)}>
                          {assignment.status === "pending" ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {statusInfo.label}
                        </div>
                        
                        {assignment.status === "pending" && (
                          <div className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", isUrgent ? "text-rose-300 bg-rose-500/20 border border-rose-400/30" : "text-amber-300 bg-amber-500/20 border border-amber-400/30")}>
                            {isUrgent ? t.dashboard.urgentBadge : t.dashboard.soonBadge}: {relTime}
                          </div>
                        )}

                        {assignment.grade && (
                          <div className="text-sm font-extrabold text-white bg-white/[0.06] border border-white/12 px-3 py-1 rounded-xl shadow-xs">
                            {assignment.grade} <span className="text-[10px] text-slate-400">/ {assignment.maxGrade || 100}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 3. Files Tab */}
          <TabsContent value="files" className="space-y-3">
            {course.files.length === 0 ? (
              <EmptyStateCard
                icon={FolderOpen}
                title={t.courseDetail.emptyFilesTitle}
                description={t.courseDetail.emptyFilesDesc}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {course.files.map((file) => {
                  const FileIconCmp = fileIconMap[file.type] || FileText;
                  
                  return (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3.5 rounded-2xl apple-glass-card p-4 shadow-lg hover:border-white/25 active:scale-[0.99] transition-all"
                    >
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <FileIconCmp className="h-5 w-5 fill-white/20" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate transition-colors group-hover:text-blue-300">
                          {translateAssignmentTitle(file.name, language)}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-blue-300/90">
                          <span className="uppercase tracking-wider">{file.type}</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 4. Grades Tab */}
          <TabsContent value="grades" className="space-y-4">
            {!hasGrades ? (
              <EmptyStateCard
                icon={GraduationCap}
                title={t.courseDetail.emptyGradesTitle}
                description={t.courseDetail.emptyGradesDesc}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.grade?.total !== undefined && (
                  <div className="sm:col-span-2 rounded-2xl apple-glass-card border-blue-500/35 bg-gradient-to-br from-blue-900/35 via-slate-900/70 to-[#0b152d]/95 p-6 flex items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                      <p className="text-sm font-bold text-blue-300 mb-1">{t.courseDetail.totalGrade}</p>
                      <span className="text-xs text-slate-300 font-medium">المعدل النهائي للمقرر</span>
                    </div>
                    <div className="text-right relative z-10">
                      <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                        {course.grade.total}
                        <span className="text-sm text-slate-400 ml-1">/ 100</span>
                      </div>
                    </div>
                  </div>
                )}

                {course.grade?.midterm !== undefined && (
                  <div className="apple-glass-card p-5 rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors shadow-lg">
                    <div>
                      <p className="text-sm font-bold text-white">{t.courseDetail.midtermExam}</p>
                    </div>
                    <div className="text-xl font-extrabold text-white tabular-nums">
                      {course.grade.midterm}
                      <span className="text-xs text-slate-400 ml-1">/ 30</span>
                    </div>
                  </div>
                )}

                {course.grade?.participation !== undefined && (
                  <div className="apple-glass-card p-5 rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors shadow-lg">
                    <div>
                      <p className="text-sm font-bold text-white">{t.courseDetail.participation}</p>
                    </div>
                    <div className="text-xl font-extrabold text-white tabular-nums">
                      {course.grade.participation}
                      <span className="text-xs text-slate-400 ml-1">/ 10</span>
                    </div>
                  </div>
                )}
                
                {course.grade?.assignments !== undefined && (
                  <div className="apple-glass-card p-5 rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors shadow-lg">
                    <div>
                      <p className="text-sm font-bold text-white">{t.courseDetail.assignmentsTab}</p>
                    </div>
                    <div className="text-xl font-extrabold text-white tabular-nums">
                      {course.grade.assignments}
                      <span className="text-xs text-slate-400 ml-1">/ 20</span>
                    </div>
                  </div>
                )}

                {course.grade?.final !== undefined && (
                  <div className="apple-glass-card p-5 rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors shadow-lg">
                    <div>
                      <p className="text-sm font-bold text-white">{t.courseDetail.finalExam}</p>
                    </div>
                    <div className="text-xl font-extrabold text-white tabular-nums">
                      {course.grade.final}
                      <span className="text-xs text-slate-400 ml-1">/ 40</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}