"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Deal {
  id: string;
  title: string;
  discountLabel: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  redemptionCount: number;
}

interface Stats {
  activeDeals: number;
  inactiveDeals: number;
  totalRedemptions: number;
}

export default function MerchantDashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<Stats>({ activeDeals: 0, inactiveDeals: 0, totalRedemptions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/merchant/dashboard");
        const data = await res.json();
        if (data.deals) setDeals(data.deals);
        if (data.stats) setStats(data.stats);
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteDeal = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    try {
      const res = await fetch(`/api/merchant/deals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeals(deals.filter(d => d.id !== id));
      }
    } catch (error) {
      console.error("Error deleting deal", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة</h2>
        <Link
          href="/merchant/deals/new"
          className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 text-sm font-medium"
        >
          إضافة عرض جديد
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">العروض النشطة</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeDeals}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">إجمالي الاستخدامات</p>
          <p className="text-3xl font-bold text-amber-600">{stats.totalRedemptions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">عروض منتهية أو متوقفة</p>
          <p className="text-3xl font-bold text-gray-900">{stats.inactiveDeals}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">عروضي</h3>
        </div>
        {deals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد عروض مضافة بعد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">العرض</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">تاريخ الانتهاء</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">الاستخدامات</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deals.map(deal => (
                  <tr key={deal.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{deal.title}</div>
                      <div className="text-sm text-gray-500">{deal.discountLabel}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        deal.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {deal.isActive ? 'نشط' : 'متوقف'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(deal.validUntil).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {deal.redemptionCount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3 space-x-reverse">
                      <Link href={`/merchant/deals/${deal.id}/edit`} className="text-amber-600 hover:text-amber-900">
                        تعديل
                      </Link>
                      <button onClick={() => deleteDeal(deal.id)} className="text-red-600 hover:text-red-900">
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
