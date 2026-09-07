import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/db-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const revalidate = 60;
import { Badge } from "@/components/ui/badge";
import { getDayLabel, formatTime, getDeadlineStatus, getRelativeTime } from "@/lib/utils";
import {
  Clock,
  MapPin,
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
} from "lucide-react";
import type { Assignment, CourseFile } from "@/lib/types";

const typeLabel: Record<Assignment["type"], string> = {
  assignment: "واجب",
  quiz: "اختبار قصير",
  project: "مشروع",
  exam: "امتحان",
};

const statusLabel: Record<Assignment["status"], { label: string; variant: "default" | "success" | "warning" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "لم يُسلَّم", variant: "warning" },
  submitted: { label: "مُسلَّم", variant: "success" },
  graded: { label: "مُصحَّح", variant: "default" },
  late: { label: "متأخر", variant: "destructive" },
};

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
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();

  const hasGrades = course.grade && (
    course.grade.midterm !== undefined ||
    course.grade.final !== undefined ||
    course.grade.assignments !== undefined ||
    course.grade.participation !== undefined ||
    course.grade.total !== undefined
  );

  return (
    <>
      <PageHeader title={course.nameAr} subtitle={`${course.code} · ${course.instructor}`} />
      <div className="px-4 py-4 max-w-2xl mx-auto lg:max-w-none space-y-4">

        {/* Course header */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div
              className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: course.color + "20" }}
            >
              <span className="text-sm font-medium" style={{ color: course.color }}>
                {course.credits}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium truncate">{course.nameAr}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{course.nameEn}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {course.room}
                </span>
                <span className="text-xs text-muted-foreground">{course.credits} ساعات معتمدة</span>
                <span className="text-xs text-muted-foreground">{course.semester}</span>
              </div>
            </div>
            {course.grade?.total !== undefined && (
              <div className="text-left flex-shrink-0 bg-secondary/50 rounded-lg px-3 py-1.5 border border-border">
                <p className="text-xl font-medium tabular-nums text-foreground">{course.grade.total}</p>
                <p className="text-[10px] text-muted-foreground text-center">من 100</p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">مواعيد المحاضرات والقاعات</p>
            <div className="flex flex-wrap gap-2">
              {course.schedule.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{getDayLabel(s.day)}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatTime(s.startTime)} – {formatTime(s.endTime)}
                  </span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                    {s.type === "lecture" ? "محاضرة" : s.type === "lab" ? "مختبر" : "درس"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assignments" className="space-y-3">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="assignments">
              الواجبات ({course.assignments.length})
            </TabsTrigger>
            <TabsTrigger value="files">
              الملفات ({course.files.length})
            </TabsTrigger>
            <TabsTrigger value="grades">
              الدرجات
            </TabsTrigger>
          </TabsList>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            {course.assignments.length === 0 ? (
              <EmptyStateCard
                icon={ClipboardList}
                title="لا توجد واجبات مطلوبة حالياً"
                description="لم يقم مدرّس المادة بإضافة أي واجبات أو مشاريع تسليم حتى الآن."
              />
            ) : (
              <div className="space-y-2">
                {course.assignments.map((assignment) => {
                  const urgency = getDeadlineStatus(assignment.dueDate);
                  const st = statusLabel[assignment.status];
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5"
                    >
                      <div className="mt-0.5">
                        {assignment.status === "submitted" || assignment.status === "graded" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{assignment.title}</p>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground">
                            {typeLabel[assignment.type]}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-xs ${
                              urgency === "urgent"
                                ? "text-destructive font-medium"
                                : urgency === "soon"
                                ? "text-amber-500 font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {urgency === "urgent" && <AlertTriangle className="h-3 w-3" />}
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(assignment.dueDate)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {assignment.maxGrade} درجة
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            {course.files.length === 0 ? (
              <EmptyStateCard
                icon={FolderOpen}
                title="لا توجد ملفات مرفوعة لهذه المادة بعد"
                description="سيتم إدراج سلايدات المحاضرات والمراجع بمجرد رفعها من قبل مدرس المساق."
              />
            ) : (
              <div className="space-y-2">
                {course.files.map((file) => {
                  const Icon = fileIconMap[file.type] || FileText;
                  return (
                    <a
                      key={file.id}
                      href={file.url}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 hover:bg-secondary/50 transition-all duration-150 group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {file.type.toUpperCase()}
                          {file.week && ` · الأسبوع ${file.week}`}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades">
            {!hasGrades ? (
              <EmptyStateCard
                icon={GraduationCap}
                title="لم تُرصد أي درجات لهذه المادة بعد"
                description="سيتم تحديث درجات الامتحان النصفي والواجبات تلقائياً عند اعتمادها من بوابة المودل."
              />
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">تفاصيل الدرجات والتقييمات</p>
                <div className="space-y-2.5 divide-y divide-border">
                  {course.grade?.midterm !== undefined && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">الامتحان النصفي</span>
                      <span className="text-sm font-medium tabular-nums">
                        {course.grade.midterm} / 50
                      </span>
                    </div>
                  )}
                  {course.grade?.assignments !== undefined && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">الواجبات والمشاريع</span>
                      <span className="text-sm font-medium tabular-nums">
                        {course.grade.assignments} / 20
                      </span>
                    </div>
                  )}
                  {course.grade?.participation !== undefined && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">المشاركة والتفاعل</span>
                      <span className="text-sm font-medium tabular-nums">
                        {course.grade.participation} / 10
                      </span>
                    </div>
                  )}
                  {course.grade?.final !== undefined && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">الامتحان النهائي</span>
                      <span className="text-sm font-medium tabular-nums">
                        {course.grade.final} / 40
                      </span>
                    </div>
                  )}
                  {course.grade?.total !== undefined && (
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-sm font-medium">المجموع التراكمي للمادة</span>
                      <span className="text-lg font-medium tabular-nums text-primary">
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
