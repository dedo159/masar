import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { computeAllCourseMetrics } from "@/lib/analytics/compute-course-metrics";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Briefcase,
  GraduationCap,
  Users,
  Award,
} from "lucide-react";

export default async function UniversityAnalyticsPage() {
  const session = await getSession();
  if (!session || session.userType !== "staff") {
    redirect("/university/login");
  }

  // Security: universityId scoping
  const universityId = session.universityId;

  // 1. إحصائيات عليا
  const totalStudents = await prisma.student.count({
    where: universityId ? { universityId } : {},
  });

  const atRiskCount = await prisma.studentEngagementSnapshot.count({
    where: {
      riskFlag: true,
      student: universityId ? { universityId } : {},
    },
  });

  // معدل التسليم بالموعد العام
  const allSubmissions = await prisma.submission.count({
    where: {
      student: universityId ? { universityId } : {},
    },
  });

  const onTimeSubmissions = await prisma.submission.count({
    where: {
      status: { in: ["submitted", "graded"] },
      student: universityId ? { universityId } : {},
    },
  });

  const generalOnTimeRate = allSubmissions > 0
    ? Math.round((onTimeSubmissions / allSubmissions) * 100)
    : 0;

  // نسبة التفاعل مع المحتوى
  const totalContentViews = await prisma.contentView.count({
    where: {
      student: universityId ? { universityId } : {},
    },
  });

  const totalFiles = await prisma.courseFile.count();
  const engagementRatio = totalFiles > 0
    ? Math.min(100, Math.round((totalContentViews / (totalFiles * Math.max(1, totalStudents))) * 100))
    : 0;

  // نسبة التقديم على التدريب
  const studentsWithApplications = await prisma.internshipApplication.groupBy({
    by: ["studentId"],
    where: {
      student: universityId ? { universityId } : {},
    },
  });

  const internshipInterestRate = totalStudents > 0
    ? Math.round((studentsWithApplications.length / totalStudents) * 100)
    : 0;

  // 2. تحليل المواد وعنق الزجاجة
  const courseMetrics = await computeAllCourseMetrics();

  // 3. تحليل فجوة المهارات: المهارات الأكثر توفراً لدى الطلاب vs المطلوبة في فرص التدريب
  const studentSkillsData = await prisma.studentSkill.groupBy({
    by: ["skillId"],
    _count: { studentId: true },
    where: {
      student: universityId ? { universityId } : {},
    },
    orderBy: { _count: { studentId: "desc" } },
    take: 6,
  });

  const requiredSkillsData = await prisma.internshipRequiredSkill.groupBy({
    by: ["skillId"],
    _count: { internshipId: true },
    orderBy: { _count: { internshipId: "desc" } },
    take: 6,
  });

  // استخراج أسماء المهارات
  const skillIds = Array.from(
    new Set([
      ...studentSkillsData.map((s) => s.skillId),
      ...requiredSkillsData.map((s) => s.skillId),
    ])
  );

  const skillsList = await prisma.skillTaxonomy.findMany({
    where: { id: { in: skillIds } },
    select: { id: true, name: true, category: true },
  });

  const skillNameMap = new Map(skillsList.map((s) => [s.id, s.name]));

  const topStudentSkills = studentSkillsData.map((s) => ({
    name: skillNameMap.get(s.skillId) || "مهارة",
    count: s._count.studentId,
  }));

  const topMarketSkills = requiredSkillsData.map((s) => ({
    name: skillNameMap.get(s.skillId) || "مهارة",
    count: s._count.internshipId,
  }));

  // 4. مؤشرات التوظيف
  const totalApplications = await prisma.internshipApplication.count({
    where: {
      student: universityId ? { universityId } : {},
    },
  });

  const acceptedApplications = await prisma.internshipApplication.count({
    where: {
      status: "accepted",
      student: universityId ? { universityId } : {},
    },
  });

  const employmentAcceptanceRate = totalApplications > 0
    ? Math.round((acceptedApplications / totalApplications) * 100)
    : 0;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <TrendingUp className="h-7 w-7 text-blue-600" />
          لوحة التحليلات الأكاديمية والتشغيلية
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          مؤشرات واقعية دقيقة للأداء الأكاديمي، كشف العقبات، ومواءمة مهارات الخريجين مع سوق العمل.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              الطلاب المعرضون للخطر
            </span>
            <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {atRiskCount}
            </span>
            <span className="text-xs text-slate-400 mr-2">من أصل {totalStudents} طالب</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {totalStudents > 0
              ? `${Math.round((atRiskCount / totalStudents) * 100)}% من إجمالي الطلبة`
              : "لا توجد بيانات"}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              معدل التسليم بالموعد
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {generalOnTimeRate}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {onTimeSubmissions} تسليم بالموعد من إجمالي {allSubmissions}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              تفاعل المحتوى الدراسي
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalContentViews}
            </span>
            <span className="text-xs text-slate-400 mr-2">مشاهدة موثقة</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            عبر {totalFiles} ملف ومحاضرة دراسية
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              الإقبال على التدريب
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {internshipInterestRate}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {studentsWithApplications.length} طالب تقدموا لفرص حقيقية
          </div>
        </div>
      </div>

      {/* Bottleneck Courses Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              المواد ذات مؤشرات التعثر (عنق الزجاجة)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ترتيب المواد حسب نسب الرسوب والتأخر في تسليم التكليفات للتدخل الأكاديمي المبكر
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 rounded-r-lg">رمز المادة واسمها</th>
                <th className="px-4 py-3">الطلبة المسجلون</th>
                <th className="px-4 py-3">نسبة النجاح</th>
                <th className="px-4 py-3">متوسط الدرجات</th>
                <th className="px-4 py-3">نسبة التسليم المتأخر</th>
                <th className="px-4 py-3 rounded-l-lg">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courseMetrics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    لا توجد مواد مسجلة حالياً
                  </td>
                </tr>
              ) : (
                courseMetrics.map((c) => (
                  <tr key={c.courseId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                      <div>{c.nameAr}</div>
                      <div className="text-xs text-slate-400 font-mono">{c.code}</div>
                    </td>
                    <td className="px-4 py-3.5">{c.totalEnrollments}</td>
                    <td className="px-4 py-3.5">
                      <span className={c.passRate >= 70 ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                        {c.passRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{c.avgGrade} / 100</td>
                    <td className="px-4 py-3.5">
                      <span className={c.lateRate > 30 ? "text-amber-600" : "text-slate-600"}>
                        {c.lateRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {c.isBottleneck ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
                          ⚠️ عنق زجاجة
                        </span>
                      ) : c.passRate >= 80 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                          ✓ أداء مستقر
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          طبيعي
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skills Gap & Employment Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Gap */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Award className="h-5 w-5 text-indigo-600" />
            تحليل فجوة المهارات وسوق العمل
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            مقارنة المهارات الأكثر توفراً لدى طلبة الجامعة بالمهارات الأكثر طلباً في سوق التدريب
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                المهارات المتوفرة لدى الطلاب:
              </h3>
              <div className="flex flex-wrap gap-2">
                {topStudentSkills.length === 0 ? (
                  <span className="text-xs text-slate-400">لا توجد مهارات مسجلة</span>
                ) : (
                  topStudentSkills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50"
                    >
                      <span>{s.name}</span>
                      <span className="bg-blue-200 dark:bg-blue-800 px-1.5 py-0.2 rounded-md text-[10px]">
                        {s.count} طالب
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                المهارات الأكثر طلباً من الشركات:
              </h3>
              <div className="flex flex-wrap gap-2">
                {topMarketSkills.length === 0 ? (
                  <span className="text-xs text-slate-400">لا توجد مهارات مطلوبة محددة</span>
                ) : (
                  topMarketSkills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                    >
                      <span>{s.name}</span>
                      <span className="bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.2 rounded-md text-[10px]">
                        {s.count} فرصة
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Employment Indicators */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            مؤشرات الجاهزية والتوظيف
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            نتائج طلبات التدريب والتحاق الطلبة بالفرص المتاحة
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {totalApplications}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    إجمالي طلبات التدريب المقدمة
                  </div>
                  <div className="text-xs text-slate-400">من طلاب الجامعة</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  {acceptedApplications}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    طلبات التدريب المقبولة
                  </div>
                  <div className="text-xs text-slate-400">تم اعتماد قبولهم من قبل الشركات</div>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-600">
                {employmentAcceptanceRate}% نسبة القبول
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
              <div className="text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                💡 التوصية التشغيلية: تركيز الورش العملية على المهارات الأعلى طلباً في سوق العمل لرفع نسبة القبول التنافسية للطلبة.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
