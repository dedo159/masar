import { DEFAULT_STUDENT_ID } from "@/lib/db-queries";
import {
  computeAcademicHealthScore,
  computeCareerReadinessScore,
  computeApplicationsSummary,
  computeWorkloadHeatmap,
} from "@/lib/analytics/compute-student-metrics";
import { prisma } from "@/lib/prisma";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Briefcase,
  GitBranch,
  Globe,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default async function StudentGrowthPage() {
  const studentId = DEFAULT_STUDENT_ID;

  // استدعاء المؤشرات الحقيقية للطالب
  const healthMetrics = await computeAcademicHealthScore(studentId);
  const careerMetrics = await computeCareerReadinessScore(studentId);
  const applications = await computeApplicationsSummary(studentId);
  const heatmap = await computeWorkloadHeatmap(studentId);

  // مهارات الطالب الفعلية من قاعدة البيانات
  const studentSkills = await prisma.studentSkill.findMany({
    where: { studentId },
    include: { skill: true },
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <TrendingUp className="h-7 w-7 text-primary" />
          لوحة النمو الأكاديمي والمهني
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          مؤشرات ذكية تقيس جاهزيتك لسوق العمل، صحتك الأكاديمية، وتنظيم جدول أعبائك الدراسية.
        </p>
      </div>

      {/* Dual Scores (Academic Health & Career Readiness) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Academic Health Score Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              درجة الصحة الأكاديمية
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              {healthMetrics.score >= 80
                ? "ممتاز 🌟"
                : healthMetrics.score >= 60
                ? "جيد جداً 👍"
                : "يحتاج تحسين ⚠️"}
            </span>
          </div>

          <div className="flex items-center gap-6 my-6">
            <div className="relative flex items-center justify-center">
              {/* Circular Gauge */}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-muted"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-indigo-600"
                  strokeWidth="10"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * healthMetrics.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-2xl font-black text-indigo-600">
                {healthMetrics.score}%
              </span>
            </div>

            <div className="flex-1 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">التسليم في الموعد (40%)</span>
                <span className="font-bold">{healthMetrics.onTimeRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${healthMetrics.onTimeRate}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">متوسط الدرجات (30%)</span>
                <span className="font-bold">{healthMetrics.avgGrade}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${healthMetrics.avgGrade}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">تفاعل المحتوى (30%)</span>
                <span className="font-bold">{healthMetrics.engagementRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${healthMetrics.engagementRate}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground pt-3 border-t border-border">
            تُحسب الدرجة تلقائياً بناءً على مواعيد تسليماتك الفعلية، درجاتك في الواجبات، ومتابعتك لملفات المواد.
          </p>
        </div>

        {/* 2. Career Readiness Score Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-500" />
              درجة الجاهزية لسوق العمل
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              {careerMetrics.score >= 70
                ? "جاهز للمنافسة 🚀"
                : "قيد البناء 🔨"}
            </span>
          </div>

          <div className="flex items-center gap-6 my-6">
            <div className="relative flex items-center justify-center">
              {/* Circular Gauge */}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-muted"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-emerald-600"
                  strokeWidth="10"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * careerMetrics.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-2xl font-black text-emerald-600">
                {careerMetrics.score}%
              </span>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  حساب GitHub المكتبي
                </span>
                <span className={careerMetrics.hasGithub ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                  {careerMetrics.hasGithub ? "مربوط (+20)" : "غير مربوط"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  معرض الأعمال Portfolio
                </span>
                <span className={careerMetrics.hasPortfolio ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                  {careerMetrics.hasPortfolio ? "مكتمل (+20)" : "غير مكتمل"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span>المهارات التقنية ({careerMetrics.skillsCount})</span>
                <span className="font-bold text-emerald-600">
                  +{Math.min(30, careerMetrics.skillsCount * 5)} نقطة
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span>طلبات التدريب ({careerMetrics.applicationsCount})</span>
                <span className="font-bold text-emerald-600">
                  +{Math.min(30, careerMetrics.applicationsCount * 5)} نقطة
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground pt-3 border-t border-border">
            كل رابط أو مهارة أو طلب تدريب تضيفه يرفع فرص ترشيحك لدى الشركات الشريكة.
          </p>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5 text-blue-500" />
          حقيبة مهاراتي الموثقة
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          المهارات التي تم التحقق منها ومطابقتها مع تصنيف المنصة المعتمد
        </p>

        <div className="flex flex-wrap gap-2.5">
          {studentSkills.length === 0 ? (
            <div className="text-xs text-muted-foreground py-3">
              لم تسجل مهارات بعد. يمكنك تحديث مهاراتك من ملفك الشخصي.
            </div>
          ) : (
            studentSkills.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                <span>{s.skill.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20">
                  {s.level === "advanced"
                    ? "متقدم"
                    : s.level === "intermediate"
                    ? "متوسط"
                    : "مبتدئ"}
                </span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Workload Heatmap & Applications Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Heatmap */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold flex items-center gap-2 mb-1">
            <Calendar className="h-5 w-5 text-amber-500" />
            خريطة أعباء الواجبات القادمة
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            توزيع مواعيد التسليم للمواد المسجلة لتخطيط وقتك بذكاء
          </p>

          <div className="space-y-3">
            {Object.keys(heatmap).length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center">
                لا توجد واجبات مجدولة حالياً 🎉
              </div>
            ) : (
              Object.entries(heatmap)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(0, 6)
                .map(([date, count]) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
                  >
                    <span className="text-xs font-mono font-medium">{date}</span>
                    <span className="flex items-center gap-2 text-xs font-semibold">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          count >= 3
                            ? "bg-red-500"
                            : count === 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      {count} {count === 1 ? "تكليف" : "تكليفات"}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Internship Applications Summary */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold flex items-center gap-2 mb-1">
            <Briefcase className="h-5 w-5 text-purple-500" />
            متابعة طلبات التدريب
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            سجل تقدمك في فرص التدريب التي تقدمت لها
          </p>

          <div className="space-y-3">
            {applications.recent.length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center">
                لم تتقدم لأي فرصة تدريب بعد. تصفح قسم التدريب وقدم الآن!
              </div>
            ) : (
              applications.recent.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
                >
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      {app.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {app.company}
                    </div>
                  </div>

                  <div>
                    {app.status === "accepted" ? (
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        مقبول 🎉
                      </span>
                    ) : app.status === "rejected" ? (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                        غير مؤهل
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                        قيد المراجعة ⏳
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
