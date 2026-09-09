import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  BookOpen,
  GraduationCap,
  Building2,
  Mail,
  Fingerprint,
  Link as LinkIcon,
  CheckCircle2,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { ErrorState } from "@/components/ui/error-state";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const student = (await prisma.student.findFirst({
    where: { id: "s-001" },
    include: {
      university: true,
      moodleConnection: true,
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  })) || (await prisma.student.findFirst({
    include: {
      university: true,
      moodleConnection: true,
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  }));

  if (!student) {
    return (
      <>
        <PageHeader title="حساب المستخدم" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="تعذر العثور على بيانات الطالب من قاعدة البيانات." />
        </div>
      </>
    );
  }

  const progressPct =
    student.totalCredits > 0
      ? Math.round((student.completedCredits / student.totalCredits) * 100)
      : 0;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2) || "ض";

  const enrolledCourses = student.enrollments.map((e) => e.course);

  return (
    <>
      <PageHeader
        title="حساب المستخدم"
        subtitle="الملف الشخصي والبيانات الأكاديمية"
      />
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto lg:max-w-none">
        {/* Main User Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 bg-secondary flex-shrink-0">
              {student.avatar && (
                <AvatarImage
                  src={student.avatar}
                  alt={student.name}
                  className="rounded-2xl object-cover"
                />
              )}
              <AvatarFallback className="rounded-2xl text-lg font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground truncate">
                  {student.name}
                </h2>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 gap-1 text-[11px]"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  حساب جامعي موثق
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mt-0.5">
                {student.major}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{student.university?.name || "جامعة عمان الأهلية"}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Fingerprint className="h-3.5 w-3.5 text-primary" />
                  <span>{student.studentId}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3.5 text-center">
            <div className="flex justify-center mb-1.5">
              <Star className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-semibold tabular-nums">{student.gpa.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">المعدل التراكمي</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 text-center">
            <div className="flex justify-center mb-1.5">
              <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-semibold tabular-nums">{enrolledCourses.length}</p>
            <p className="text-xs text-muted-foreground">المواد الحالية</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 text-center">
            <div className="flex justify-center mb-1.5">
              <GraduationCap className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-semibold tabular-nums">
              {student.completedCredits}
            </p>
            <p className="text-xs text-muted-foreground">ساعة مكتملة</p>
          </div>
        </div>

        {/* Moodle Integration Card */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">الربط الإلكتروني (Moodle V-Class)</p>
                <p className="text-xs text-muted-foreground">
                  بوابة التعليم الإلكتروني لجامعة عمان الأهلية
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              متصل
            </Badge>
          </div>

          <div className="bg-secondary/40 rounded-lg p-3 text-xs space-y-1.5 border border-border/50">
            <div className="flex justify-between">
              <span className="text-muted-foreground">الخادم:</span>
              <span className="font-mono text-foreground" dir="ltr">
                {student.moodleConnection?.moodleBaseUrl || "vclass.ammanu.edu.jo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">طريقة المصادقة:</span>
              <span className="text-foreground">رمز مشفّر AES-256-GCM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">المواد المستوردة:</span>
              <span className="text-foreground font-medium">
                {enrolledCourses.length} مواد نشطة
              </span>
            </div>
          </div>
        </div>

        {/* Real Enrolled Courses */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">المواد المسجلة في حسابك</p>
            <Link
              href="/courses"
              className="text-xs text-primary hover:underline flex items-center gap-0.5"
            >
              عرض الكل
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {enrolledCourses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/60 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {c.nameAr}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {c.code} · {c.instructor}
                    </p>
                  </div>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Degree Progress */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">تقدّم مسار التخرج</p>
            <span className="text-sm font-medium text-primary tabular-nums">
              {progressPct}%
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            تم إنجاز {student.completedCredits} من إجمالي {student.totalCredits} ساعة معتمدة.
          </p>
        </div>

        {/* Account Actions */}
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <Link
            href="/settings"
            className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                <Settings className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">إعدادات الحساب</p>
                <p className="text-xs text-muted-foreground">
                  تعديل التنبيهات، المظهر، وربط التقويم
                </p>
              </div>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-destructive">تسجيل الخروج</p>
                <p className="text-xs text-muted-foreground">
                  إنهاء الجلسة والعودة لشاشة الدخول
                </p>
              </div>
            </div>
            <ChevronLeft className="h-4 w-4 text-destructive" />
          </Link>
        </div>
      </div>
    </>
  );
}
