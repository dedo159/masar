import { getStudentProfile } from "@/lib/db-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code2, ExternalLink, Star, BookOpen, Award, Globe } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const student = await getStudentProfile();

  if (!student) {
    return (
      <>
        <PageHeader title="الملف الشخصي" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="تعذر العثور على بيانات الطالب من قاعدة البيانات." />
        </div>
      </>
    );
  }

  const progressPct = student.totalCredits > 0 ? Math.round((student.completedCredits / student.totalCredits) * 100) : 0;
  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <>
      <PageHeader title="الملف الشخصي" />
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto lg:max-w-none">

        {/* Profile card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 rounded-xl border border-border">
              <AvatarFallback className="rounded-xl text-base font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.major}</p>
              <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                {student.email}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <Badge variant="secondary">السنة الدراسية: {student.year}</Badge>
                <Badge variant="secondary">الرقم الجامعي: {student.studentId}</Badge>
              </div>
            </div>
          </div>

          {/* External Profile Links */}
          {(student.github || student.portfolio) && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
              {student.github && (
                <a
                  href={`https://${student.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary/60 hover:bg-secondary px-2.5 py-1 rounded-md border border-border"
                >
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  <span dir="ltr">GitHub</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
              )}
              {student.portfolio && (
                <a
                  href={student.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary/60 hover:bg-secondary px-2.5 py-1 rounded-md border border-border"
                >
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  <span>معرض الأعمال</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-medium tabular-nums">{student.gpa.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">المعدل التراكمي</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 text-center">
            <div className="flex justify-center mb-2">
              <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-medium tabular-nums">{student.completedCredits}</p>
            <p className="text-xs text-muted-foreground">ساعة مكتملة</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 text-center">
            <div className="flex justify-center mb-2">
              <Award className="h-4 w-4 text-violet-500" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-medium tabular-nums">{student.year}</p>
            <p className="text-xs text-muted-foreground">سنة دراسية</p>
          </div>
        </div>

        {/* Degree progress */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">تقدّم متطلبات التخرج</p>
            <span className="text-sm font-medium text-primary tabular-nums">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            تم اجتياز {student.completedCredits} من إجمالي {student.totalCredits} ساعة معتمدة
          </p>
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium mb-3">المهارات التقنية</p>
          {student.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-secondary px-3 py-1 text-xs font-mono text-foreground border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">لم تتم إضافة أي مهارات بعد.</p>
          )}
        </div>
      </div>
    </>
  );
}
