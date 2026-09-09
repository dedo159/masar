import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { computeMerchantMetrics } from "@/lib/analytics/compute-merchant-metrics";
import {
  Tag,
  Clock,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default async function MerchantAnalyticsPage() {
  const session = await getSession();
  if (!session || session.userType !== "merchant" || !session.merchantId) {
    redirect("/merchant/login");
  }

  const merchantId = session.merchantId;

  // جلب المؤشرات المحسوبة من البيانات الحقيقية
  const metrics = await computeMerchantMetrics(merchantId);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <TrendingUp className="h-7 w-7 text-amber-600" />
          تحليلات المبيعات واستخدام العروض
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          رؤى دقيقة حول تفاعل الطلبة مع خصوماتك، ساعات الإقبال القصوى، ونسبة ولاء العملاء.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              إجمالي الاستخدامات
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Tag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {metrics.totalRedemptions}
            </span>
            <span className="text-xs text-gray-400 mr-2">مرة استخدام</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              العروض النشطة
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {metrics.activeDeals}
            </span>
            <span className="text-xs text-gray-400 mr-2">من {metrics.totalDeals} عرض</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              نسبة العملاء العائدين
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <RotateCcw className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {metrics.returningRate}%
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.returningStudents} طالب استفادوا أكثر من مرة
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              ساعة الذروة اليومية
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {metrics.peakCount > 0 ? `${metrics.peakHour}:00` : "—"}
            </span>
            <span className="text-xs text-gray-400 mr-2">
              {metrics.peakCount > 0 ? `(${metrics.peakCount} استخدام)` : ""}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            الوقت الأكثر إقبالاً من الطلاب
          </div>
        </div>
      </div>

      {/* Top Performing Deals */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              أفضل العروض أداءً وتفضيلاً
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              ترتيب العروض حسب عدد مرات الاستخدام الفعلية من الطلبة
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="text-xs uppercase bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 rounded-r-lg">عنوان العرض</th>
                <th className="px-4 py-3">قيمة الخصم</th>
                <th className="px-4 py-3">إجمالي الاستخدامات</th>
                <th className="px-4 py-3">تاريخ الانتهاء</th>
                <th className="px-4 py-3 rounded-l-lg">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics.topDeals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    لا توجد عروض مضافة بعد
                  </td>
                </tr>
              ) : (
                metrics.topDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {deal.title}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                        {deal.discountLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-gray-900">
                      {deal.redemptionCount}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {deal.validUntil.toISOString().split("T")[0]}
                    </td>
                    <td className="px-4 py-3.5">
                      {deal.isActive && deal.validUntil >= new Date() ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          منتهي / متوقف
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

      {/* Hourly Distribution Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-purple-600" />
          توزيع الإقبال حسب ساعات اليوم
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          يساعدك في تحديد فترات طرح العروض الترويجية الحصرية للطلاب
        </p>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {Array.from({ length: 24 }).map((_, hour) => {
            const count = metrics.hourlyDistribution[hour] || 0;
            const isPeak = metrics.peakCount > 0 && count === metrics.peakCount;
            return (
              <div
                key={hour}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isPeak
                    ? "bg-amber-100 border-amber-300 ring-2 ring-amber-400"
                    : count > 0
                    ? "bg-amber-50/50 border-amber-100"
                    : "bg-gray-50 border-gray-100 text-gray-400"
                }`}
              >
                <div className="text-[11px] font-mono text-gray-500">
                  {hour}:00
                </div>
                <div className="text-base font-bold text-gray-800 mt-1">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
