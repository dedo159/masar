import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { computeCompanyInternshipMetrics } from "@/lib/analytics/compute-internship-metrics";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
  Award,
  Filter,
} from "lucide-react";

export default async function CompanyAnalyticsPage() {
  const session = await getSession();
  if (!session || session.userType !== "recruiter" || !session.companyId) {
    redirect("/company/login");
  }

  const companyId = session.companyId;

  // استدعاء مؤشرات الشركة المحسوبة من البيانات الحقيقية
  const metrics = await computeCompanyInternshipMetrics(companyId);

  const pendingCount = metrics.funnel["pending"] || 0;
  const reviewedCount = metrics.funnel["reviewed"] || 0;
  const acceptedCount = metrics.funnel["accepted"] || 0;
  const rejectedCount = metrics.funnel["rejected"] || 0;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <TrendingUp className="h-7 w-7 text-emerald-600" />
          تحليلات استقطاب المواهب والتوظيف
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          مؤشرات دقيقة حول قمع الاستقطاب، سرعة مراجعة الطلبات، وتفاعل الكفاءات الطلابية مع فرصك.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              فرص التدريب النشطة
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalInternships}
            </span>
            <span className="text-xs text-slate-400 mr-2">فرصة منشورة</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              إجمالي طلبات التقديم
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalApplications}
            </span>
            <span className="text-xs text-slate-400 mr-2">طلب مستلم</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              نسبة القبول العامة
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.acceptanceRate}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {acceptedCount} طالب تم قبولهم بنجاح
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              متوسط وقت المراجعة
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.avgReviewDays > 0 ? `${metrics.avgReviewDays}` : "—"}
            </span>
            <span className="text-xs text-slate-400 mr-1.5">يوم عمل</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            من تاريخ التقديم حتى اتخاذ القرار
          </div>
        </div>
      </div>

      {/* Recruitment Funnel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-emerald-600" />
              قمع استقطاب وتعيين المتدربين (Recruitment Funnel)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              توزيع طلبات التقديم عبر مراحل التقييم والمراجعة والقبول
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-center">
            <div className="text-xs text-amber-800 dark:text-amber-400 font-semibold mb-1">
              قيد المراجعة (Pending)
            </div>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-1">
              {metrics.totalApplications > 0
                ? `${Math.round((pendingCount / metrics.totalApplications) * 100)}% من الإجمالي`
                : "0%"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-center">
            <div className="text-xs text-blue-800 dark:text-blue-400 font-semibold mb-1">
              تمت المراجعة (Reviewed)
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              {reviewedCount}
            </div>
            <div className="text-[11px] text-blue-700/80 mt-1">
              {metrics.totalApplications > 0
                ? `${Math.round((reviewedCount / metrics.totalApplications) * 100)}% من الإجمالي`
                : "0%"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-center">
            <div className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold mb-1">
              مقبول (Accepted)
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
              {acceptedCount}
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-1">
              {metrics.totalApplications > 0
                ? `${Math.round((acceptedCount / metrics.totalApplications) * 100)}% من الإجمالي`
                : "0%"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center">
            <div className="text-xs text-rose-800 dark:text-rose-400 font-semibold mb-1">
              مرفوض (Rejected)
            </div>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-200">
              {rejectedCount}
            </div>
            <div className="text-[11px] text-rose-700/80 mt-1">
              {metrics.totalApplications > 0
                ? `${Math.round((rejectedCount / metrics.totalApplications) * 100)}% من الإجمالي`
                : "0%"}
            </div>
          </div>
        </div>
      </div>

      {/* Internships Performance Table & Skills Demanded */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Internships Performance Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Eye className="h-5 w-5 text-blue-600" />
            أداء فرص التدريب ومعدلات التحويل
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            مقارنة عدد المشاهدات الفعلي بعدد المتقدمين لكل فرصة منشورة
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 rounded-r-lg">عنوان الفرصة</th>
                  <th className="px-4 py-3">المشاهدات</th>
                  <th className="px-4 py-3">المتقدمون</th>
                  <th className="px-4 py-3 rounded-l-lg">معدل التقديم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.perInternship.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">
                      لم تقم بنشر أي فرص تدريب بعد
                    </td>
                  </tr>
                ) : (
                  metrics.perInternship.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {i.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {i.viewsCount}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {i.applicationsCount}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                          {i.applicationRate}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demanded Skills (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Award className="h-5 w-5 text-purple-600" />
            المهارات الأكثر طلباً في إعلاناتك
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            توزيع المتطلبات في فرص شركتك
          </p>

          <div className="space-y-3">
            {metrics.topSkills.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">
                لم يتم تحديد مهارات لفرص التدريب
              </div>
            ) : (
              metrics.topSkills.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                >
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {s.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    مطلوبة في {s.count} فرصة
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
