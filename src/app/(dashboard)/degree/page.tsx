import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEnrolledCourses } from "@/lib/db-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  AlertCircle, 
  ArrowLeft
} from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DegreePage() {
  let student = null;
  let enrolledCourses = [];

  try {
    const [st, courses] = await Promise.all([
      prisma.student.findFirst({
        where: { id: "s-001" },
        include: { university: true },
      }) || prisma.student.findFirst({
        include: { university: true },
      }),
      getEnrolledCourses(),
    ]);
    student = st;
    enrolledCourses = courses.filter((c) => c.status === "enrolled");
  } catch (error) {
    console.error("DegreePage fetch error:", error);
    return (
      <>
        <PageHeader title="مسار التخرج" subtitle="خطأ في الاتصال" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="تعذر تحميل بيانات مسار التخرج من الخادم." />
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <PageHeader title="مسار التخرج" />
        <div className="px-4 py-8 max-w-2xl mx-auto lg:max-w-none">
          <ErrorState message="لم يتم العثور على سجل الطالب." />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="مسار التخرج"
        subtitle={`متابعة المقررات والمسار الأكاديمي — ${student.major}`}
      />
      <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto lg:max-w-none">

        {/* بطاقة التخصص والأكاديميا الحقيقية */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">{student.major}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{student.university?.name || "الجامعة"}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-normal border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-1.5 animate-pulse" />
              متزامن مع Moodle
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
            <div className="p-2.5 rounded-lg bg-secondary/40">
              <p className="text-xs text-muted-foreground">الرقم الجامعي</p>
              <p className="text-sm font-medium text-foreground mt-0.5 tabular-nums">{student.studentId}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/40">
              <p className="text-xs text-muted-foreground">المساقات المسجلة</p>
              <p className="text-sm font-medium text-foreground mt-0.5 tabular-nums">{enrolledCourses.length} مواد</p>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/40 col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground">مصدر البيانات</p>
              <p className="text-sm font-medium text-foreground mt-0.5">LMS / Moodle</p>
            </div>
          </div>
        </div>

        {/* تنبيه شفاف عن الخطة الشجرية والسجل التراكمي */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              اعتماد الساعات والخطة الشجرية للتخرج
            </p>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              الساعات المعتمدة المتبقية والمعدل التراكمي وتوزيع متطلبات التخرج (الإجبارية والاختيارية) تصدر رسمياً عن نظام القبول والتسجيل الجامعي (SIS). المقررات المعروضة أدناه هي المقررات الفعلية المسجلة في حسابك الجامعي عبر Moodle.
            </p>
          </div>
        </div>

        {/* المقررات الدراسية الحقيقية المسجلة */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              المقررات المسجلة حالياً
            </h3>
            <span className="text-xs text-muted-foreground tabular-nums">
              {enrolledCourses.length} مساق نشط
            </span>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium text-foreground">لا توجد مواد مسجلة لهذا الفصل</p>
              <p className="text-xs text-muted-foreground mt-1">تأكد من تسجيلك في المقررات عبر نظام مودل الجامعي.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: course.color || "#6366F1" }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        مُسجَّل
                      </Badge>
                    </div>
                    <h4 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                      {course.nameAr || course.nameEn}
                    </h4>
                    {course.instructor && (
                      <p className="text-xs text-muted-foreground">
                        المدرس: {course.instructor}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {course.semester || "الفصل الحالي"}
                    </span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      تفاصيل المادة
                      <ArrowLeft className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
