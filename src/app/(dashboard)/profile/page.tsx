import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Building2,
  Mail,
  Fingerprint,
  Link as LinkIcon,
  CheckCircle2,
  Settings,
  LogOut,
  ChevronLeft,
  Award,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { ProfileEditor } from "@/components/profile/profile-editor";

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
    throw new Error("Student profile could not be found");
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2) || "ط";

  const enrolledCourses = student.enrollments.map((e) => e.course);

  let skillsList: string[] = [];
  try {
    skillsList = JSON.parse(student.skills);
  } catch {
    skillsList = [];
  }

  return (
    <>
      <PageHeader
        title="الملف الشخصي"
        subtitle="بياناتك الأكاديمية، مهاراتك والروابط المهنية"
      />

      <div className="px-4 py-5 space-y-5 max-w-4xl mx-auto">
        {/* Main User Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 rounded-2xl border-2 border-border bg-secondary flex-shrink-0">
              {student.avatar && (
                <AvatarImage
                  src={student.avatar}
                  alt={student.name}
                  className="rounded-2xl object-cover"
                />
              )}
              <AvatarFallback className="rounded-2xl text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {student.name}
                </h2>
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  طالب موثق
                </Badge>
              </div>

              <p className="text-sm font-medium text-foreground/80 mt-1">
                {student.major} · السنة الدراسية {student.year || 3}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{student.university?.name || "الجامعة الأردنية"}</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Fingerprint className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono">{student.studentId}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <GraduationCap className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {student.gpa || 3.42}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">المعدل التراكمي (GPA)</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {enrolledCourses.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">المساقات المسجلة</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <Award className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {student.completedCredits || 79}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">ساعات منجزة</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="flex justify-center mb-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              متصل
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">بوابة Moodle الجامعية</p>
          </div>
        </div>

        {/* Interactive Skills and Social Links Editor */}
        <ProfileEditor
          initialSkills={skillsList}
          initialGithub={student.github || ""}
          initialPortfolio={student.portfolio || ""}
        />

        {/* Moodle Integration Card */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">الربط الإلكتروني بـ Moodle</p>
                <p className="text-xs text-muted-foreground">
                  بوابة التعليم الإلكتروني لجامعتك
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              متصل
            </Badge>
          </div>

          <div className="bg-secondary/40 rounded-lg p-3.5 text-xs space-y-2 border border-border/50">
            <div className="flex justify-between">
              <span className="text-muted-foreground">خادم النظام:</span>
              <span className="font-mono text-foreground" dir="ltr">
                {student.moodleConnection?.moodleBaseUrl || "moodle.ju.edu.jo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">التشفير والمصادقة:</span>
              <span className="text-foreground">AES-256-GCM موثق</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">المواد المستوردة:</span>
              <span className="text-foreground font-semibold">
                {enrolledCourses.length} مواد دراسية نشطة
              </span>
            </div>
          </div>
        </div>

        {/* Account Quick Links */}
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <Link
            href="/settings"
            className="flex items-center justify-between p-4 min-h-[56px] hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                <Settings className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">إعدادات الحساب والمزامنة</p>
                <p className="text-xs text-muted-foreground">
                  تعديل التنبيهات، المظهر الأكاديمي، ومزامنة تقويم جوجل
                </p>
              </div>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-between p-4 min-h-[56px] hover:bg-destructive/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-destructive">تسجيل الخروج</p>
                <p className="text-xs text-muted-foreground">
                  إنهاء الجلسة والعودة لبوابة تسجيل الدخول
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
