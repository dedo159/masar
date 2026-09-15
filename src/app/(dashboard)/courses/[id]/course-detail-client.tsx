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
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-dashed border-border bg-card text-center transition-colors">
      <div className="h-14 w-14 rounded-2xl fintech-gradient-blue flex items-center justify-center mb-4 shadow-lg text-foreground">
        <Icon className="h-6 w-6 fill-white/20" strokeWidth={2} />
      </div>
      <p className="text-base font-bold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed font-medium">{description}</p>
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
    pending: { label: t.courseDetail.assignmentStatus.pending, bg: "bg-[#ff5b4f]/10 border-[#ff5b4f]/20", text: "text-[#ff5b4f]" },
    submitted: { label: t.courseDetail.assignmentStatus.submitted, bg: "bg-[#0a72ef]/10 border-[#0a72ef]/20", text: "text-[#0a72ef]" },
    graded: { label: t.courseDetail.assignmentStatus.graded, bg: "bg-[#3B82F6]/10 border-[#3B82F6]/20", text: "text-[#3B82F6]" },
    late: { label: t.courseDetail.assignmentStatus.late, bg: "bg-[#EF4444]/10 border-[#EF4444]/20", text: "text-[#EF4444]" },
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
        subtitle={`${course.code} آ· ${instructorName}`}
      />

      <div className="px-4 py-5 max-w-5xl mx-auto space-y-5">
        {/* Course Header Hero Card */}
        <div className="vercel-card p-5 shadow-sm relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div
              className="h-14 w-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-foreground shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${course.color || "#3B82F6"} 0%, ${course.color || "#8B5CF6"}99 100%)`,
              }}
            >
              <BookOpen className="h-6 w-6 fill-white/20" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground truncate">
                    {displayName}
                  </h2>
                  {subName && <p className="text-xs text-muted-foreground mt-1 font-medium">{subName}</p>}
                </div>

                {course.grade?.total !== undefined && (
                  <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-secondary px-3 py-1.5 rounded-xl border border-border">
                    <span className="text-xs text-muted-foreground font-semibold">{t.courseDetail.totalGrade}:</span>
                    <span className="text-base font-extrabold tabular-nums text-foreground">
                      {course.grade.total} <span className="text-[10px] text-muted-foreground/60">/ 100</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground/80 font-semibold">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{t.courseDetail.instructor}: {instructorName}</span>
                </span>
                {course.room && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.courseDetail.room}: {translateRoom(course.room, language)}</span>
                  </span>
                )}
                <span>{course.credits || 3} {t.courseDetail.creditHours}</span>
                <span>{semesterName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Clean Tabs */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto p-1.5 gap-1.5 bg-secondary/50 border border-border rounded-lg">
            <TabsTrigger value="schedule" className="min-h-[40px] text-xs font-bold rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground">
              {t.courseDetail.scheduleTab}
            </TabsTrigger>
            <TabsTrigger value="assignments" className="min-h-[40px] text-xs font-bold rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground">
              {t.courseDetail.assignmentsTab} ({course.assignments.length})
            </TabsTrigger>
            <TabsTrigger value="files" className="min-h-[40px] text-xs font-bold rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground">
              {t.courseDetail.filesTab} ({course.files.length})
            </TabsTrigger>
            <TabsTrigger value="grades" className="min-h-[40px] text-xs font-bold rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {course.schedule.map((slot, index) => {
                  const dayName = dayNames[slot.day.toLowerCase()] || slot.day;
                  const isLab = slot.type === "lab";

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-border/50 hover:bg-white/[0.02]"
                    >
                      <div className="h-10 w-10 rounded-2xl fintech-gradient-blue flex items-center justify-center flex-shrink-0 shadow-md">
                        {isLab ? (
                          <FlaskConical className="h-4 w-4 text-foreground fill-white/20" strokeWidth={2} />
                        ) : (
                          <BookOpen className="h-4 w-4 text-foreground fill-white/20" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-foreground">{dayName}</p>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", isLab ? "bg-[#ff5b4f]/10 text-[#ff5b4f] border-[#ff5b4f]/20" : "bg-secondary text-muted-foreground/90 border-transparent")}>
                            {isLab ? t.courseDetail.classTypes.lab : t.courseDetail.classTypes.lecture}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 tabular-nums flex items-center gap-1.5 font-semibold">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(slot.startTime, language)} - {formatTime(slot.endTime, language)}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-semibold">
                          <MapPin className="h-3 w-3" />
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
                        "flex flex-col sm:flex-row sm:items-start gap-4 rounded-lg border bg-card p-4 transition-all relative overflow-hidden",
                        isUrgent ? "border-[#EF4444]/40 hover:border-[#EF4444]/80 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-border hover:border-border/50 hover:bg-white/[0.02]"
                      )}
                    >
                      {isUrgent && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF4444]/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      )}

                      <div className="flex-1 min-w-0 z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {title}
                          </h4>
                          <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                            {typeLabel[assignment.type] || assignment.type}
                          </span>
                        </div>
                        {desc && (
                          <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1 leading-relaxed font-medium">
                            {desc}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground/60 font-semibold tabular-nums">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {assignment.dueDate}
                          </span>
                          {assignment.dueTime && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {assignment.dueTime}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={cn("flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 z-10 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border", isRtl ? "sm:text-left" : "sm:text-right")}>
                        <div className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1.5", statusInfo.bg, statusInfo.text)}>
                          {assignment.status === "pending" ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {statusInfo.label}
                        </div>
                        
                        {assignment.status === "pending" && (
                          <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", isUrgent ? "text-[#EF4444] bg-[#EF4444]/10" : "text-[#ff5b4f] bg-[#ff5b4f]/10")}>
                            {isUrgent ? t.dashboard.urgentBadge : t.dashboard.soonBadge}: {relTime}
                          </div>
                        )}

                        {assignment.grade && (
                          <div className="text-sm font-extrabold text-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
                            {assignment.grade} <span className="text-[10px] text-muted-foreground/60">/ {assignment.maxGrade || 100}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {course.files.map((file) => {
                  const FileIconCmp = fileIconMap[file.type] || FileText;
                  const isLink = file.type === "link";
                  
                  return (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-border/50 hover:bg-white/[0.02]"
                    >
                      <div className="h-10 w-10 rounded-2xl fintech-gradient-blue flex items-center justify-center flex-shrink-0 shadow-md">
                        <FileIconCmp className="h-4 w-4 text-foreground fill-white/20" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate transition-colors group-hover:text-[#3B82F6]">
                          {translateAssignmentTitle(file.name, language)}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-semibold text-muted-foreground">
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
                  <div className="sm:col-span-2 rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-6 flex items-center justify-between shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#3B82F6]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                      <p className="text-sm font-bold text-[#3B82F6] mb-1">{t.courseDetail.totalGrade}</p>
                      
                    </div>
                    <div className="text-right relative z-10">
                      <div className="text-4xl font-extrabold text-foreground tabular-nums tracking-tighter">
                        {course.grade.total}
                        <span className="text-lg text-muted-foreground/60 ml-1">/100</span>
                      </div>
                    </div>
                  </div>
                )}

                {course.grade?.midterm !== undefined && (
                  <div className="vercel-card p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.courseDetail.midtermExam}</p>
                    </div>
                    <div className="text-xl font-extrabold text-foreground tabular-nums">
                      {course.grade.midterm}
                      <span className="text-xs text-muted-foreground/60 ml-1">/ 30</span>
                    </div>
                  </div>
                )}

                {course.grade?.participation !== undefined && (
                  <div className="vercel-card p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.courseDetail.participation}</p>
                    </div>
                    <div className="text-xl font-extrabold text-foreground tabular-nums">
                      {course.grade.participation}
                      <span className="text-xs text-muted-foreground/60 ml-1">/ 10</span>
                    </div>
                  </div>
                )}
                
                {course.grade?.assignments !== undefined && (
                  <div className="vercel-card p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.courseDetail.assignmentsTab}</p>
                    </div>
                    <div className="text-xl font-extrabold text-foreground tabular-nums">
                      {course.grade.assignments}
                      <span className="text-xs text-muted-foreground/60 ml-1">/ 20</span>
                    </div>
                  </div>
                )}

                {course.grade?.final !== undefined && (
                  <div className="vercel-card p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.courseDetail.finalExam}</p>
                    </div>
                    <div className="text-xl font-extrabold text-foreground tabular-nums">
                      {course.grade.final}
                      <span className="text-xs text-muted-foreground/60 ml-1">/ 40</span>
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