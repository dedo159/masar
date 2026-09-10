"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getDeadlineStatus, getRelativeTime, formatTime } from "@/lib/utils";
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
import { translateCourseName, translateInstructor, translateSemester, translateAssignmentTitle } from "@/lib/translations/academic";
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
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50 text-center">
      <div className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-3">
        <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { t, language } = useLanguage();
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
    { label: string; variant: "default" | "success" | "warning" | "secondary" | "destructive" | "neutral" }
  > = {
    pending: { label: t.courseDetail.assignmentStatus.pending, variant: "warning" },
    submitted: { label: t.courseDetail.assignmentStatus.submitted, variant: "success" },
    graded: { label: t.courseDetail.assignmentStatus.graded, variant: "default" },
    late: { label: t.courseDetail.assignmentStatus.late, variant: "destructive" },
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

      <div className="px-4 py-5 max-w-5xl mx-auto space-y-5">
        {/* Course Header Hero Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div
              className="h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{
                backgroundColor: `${course.color || "currentColor"}18`,
                color: course.color || "currentColor",
              }}
            >
              <BookOpen className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {displayName}
                  </h2>
                  {subName && <p className="text-xs text-muted-foreground mt-0.5">{subName}</p>}
                </div>

                {course.grade?.total !== undefined && (
                  <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    <span className="text-xs text-muted-foreground">{t.courseDetail.totalGrade}:</span>
                    <span className="text-base font-bold tabular-nums text-foreground">
                      {course.grade.total} / 100
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{t.courseDetail.instructor}: {instructorName}</span>
                </span>
                {course.room && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.courseDetail.room}: {course.room}</span>
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
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-1">
            <TabsTrigger value="schedule" className="min-h-[40px] text-xs">
              {t.courseDetail.scheduleTab}
            </TabsTrigger>
            <TabsTrigger value="assignments" className="min-h-[40px] text-xs">
              {t.courseDetail.assignmentsTab} ({course.assignments.length})
            </TabsTrigger>
            <TabsTrigger value="files" className="min-h-[40px] text-xs">
              {t.courseDetail.filesTab} ({course.files.length})
            </TabsTrigger>
            <TabsTrigger value="grades" className="min-h-[40px] text-xs">
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
                      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20"
                    >
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        {isLab ? (
                          <FlaskConical className="h-4 w-4 text-primary" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{dayName}</p>
                          <Badge variant={isLab ? "warning" : "secondary"}>
                            {isLab ? t.courseDetail.classTypes.lab : t.courseDetail.classTypes.lecture}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 tabular-nums flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(slot.startTime, language)} - {formatTime(slot.endTime, language)}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{course.room || t.courseDetail.defaultRoom}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 2. Assignments Tab */}
          <TabsContent value="assignments" className="space-y-2">
            {course.assignments.length === 0 ? (
              <EmptyStateCard
                icon={ClipboardList}
                title={t.courseDetail.emptyAssignmentsTitle}
                description={t.courseDetail.emptyAssignmentsDesc}
              />
            ) : (
              <div className="space-y-2.5">
                {course.assignments.map((assignment) => {
                  const urgency = getDeadlineStatus(assignment.dueDate, assignment.dueTime);
                  const st = statusConfig[assignment.status] || { label: assignment.status, variant: "secondary" };
                  const isDone = assignment.status === "submitted" || assignment.status === "graded";

                  return (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-foreground/20"
                    >
                      <div className="mt-1">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{translateAssignmentTitle(assignment.title, language)}</p>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                          <span className="text-muted-foreground font-medium">
                            {typeLabel[assignment.type] || t.courseDetail.assignmentTypes.assignment}
                          </span>

                          <span
                            className={`flex items-center gap-1 font-medium ${
                              urgency === "urgent"
                                ? "text-destructive"
                                : urgency === "soon"
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {urgency === "urgent" && <AlertTriangle className="h-3 w-3" />}
                            <Clock className="h-3 w-3" />
                            <span>{getRelativeTime(assignment.dueDate, assignment.dueTime, language)}</span>
                            {assignment.dueTime && assignment.dueTime !== "--:--" && (
                              <span className="tabular-nums">({assignment.dueTime} {t.courseDetail.jordanTime})</span>
                            )}
                          </span>

                          {assignment.grade !== undefined ? (
                            <Badge variant="success">
                              {t.courseDetail.grade}: {assignment.grade} / {assignment.maxGrade}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              {assignment.maxGrade} {t.courseDetail.gradePoints}
                            </span>
                          )}
                        </div>

                        {assignment.description &&
                          assignment.description.trim() !== "" &&
                          assignment.description !== assignment.title && (
                            <div className="mt-2.5 p-3 rounded-lg bg-secondary/40 border border-border/60 text-xs text-foreground/85 leading-relaxed whitespace-pre-line">
                              {assignment.description}
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
          <TabsContent value="files" className="space-y-2">
            {course.files.length === 0 ? (
              <EmptyStateCard
                icon={FolderOpen}
                title={t.courseDetail.emptyFilesTitle}
                description={t.courseDetail.emptyFilesDesc}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.files.map((file) => {
                  const Icon = fileIconMap[file.type] || FileText;
                  return (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 min-h-[56px] hover:bg-secondary/40 hover:border-foreground/20 transition-all duration-150 group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-foreground">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {file.type.toUpperCase()}
                          {file.week && ` · ${t.courseDetail.weekPrefix} ${file.week}`}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* 4. Grades Tab */}
          <TabsContent value="grades">
            {!hasGrades ? (
              <EmptyStateCard
                icon={GraduationCap}
                title={t.courseDetail.emptyGradesTitle}
                description={t.courseDetail.emptyGradesDesc}
              />
            ) : (
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t.courseDetail.gradesBreakdown}
                  </h3>
                  {course.grade?.letter && (
                    <Badge variant="default" className="text-sm px-2.5 py-0.5 font-bold">
                      {t.courseDetail.gradeLetter}: {course.grade.letter}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 divide-y divide-border">
                  {course.grade?.midterm !== undefined && (
                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">{t.courseDetail.midtermExam}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.courseDetail.midtermDesc}</p>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-foreground bg-secondary px-2.5 py-1 rounded-md">
                        {course.grade.midterm} / 30
                      </span>
                    </div>
                  )}

                  {course.grade?.assignments !== undefined && (
                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">{t.courseDetail.coursework}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.courseDetail.courseworkDesc}</p>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-foreground bg-secondary px-2.5 py-1 rounded-md">
                        {course.grade.assignments} / 20
                      </span>
                    </div>
                  )}

                  {course.grade?.participation !== undefined && (
                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">{t.courseDetail.participation}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.courseDetail.participationDesc}</p>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-foreground bg-secondary px-2.5 py-1 rounded-md">
                        {course.grade.participation} / 10
                      </span>
                    </div>
                  )}

                  {course.grade?.final !== undefined && (
                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">{t.courseDetail.finalExam}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.courseDetail.finalExamDesc}</p>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-foreground bg-secondary px-2.5 py-1 rounded-md">
                        {course.grade.final} / 40
                      </span>
                    </div>
                  )}

                  {course.grade?.total !== undefined && (
                    <div className="flex items-center justify-between pt-3 bg-secondary/30 p-3 rounded-lg border border-border">
                      <div>
                        <span className="text-sm font-bold text-foreground">{t.courseDetail.cumulativeTotal}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.courseDetail.cumulativeTotalDesc}</p>
                      </div>
                      <span className="text-base font-extrabold tabular-nums text-foreground">
                        {course.grade.total} / 100
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
