"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

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
    const { t } = useLanguage();
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
    if (!confirm(t.merchantportaldashboardpagetsx.text_8bsp)) return;
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
    return <div className="text-center py-10">{t.merchantportaldashboardpagetsx.text_qxqf}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t.merchantportaldashboardpagetsx.text_t4d6}</h2>
        <Link
          href="/merchant/deals/new"
          className="bg-amber-600 text-foreground px-4 py-2 rounded-md hover:bg-amber-700 text-sm font-medium"
        >
          {t.merchantportaldashboardpagetsx.text_o4e9}</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">{t.merchantportaldashboardpagetsx.text_kbg4}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeDeals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">{t.merchantportaldashboardpagetsx.text_ln6d}</p>
          <p className="text-3xl font-bold text-amber-600">{stats.totalRedemptions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">{t.merchantportaldashboardpagetsx.text_6tfp}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.inactiveDeals}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t.merchantportaldashboardpagetsx.text_bai2}</h3>
        </div>
        {deals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t.merchantportaldashboardpagetsx.text_diel}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.merchantportaldashboardpagetsx.text_qonw}</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.merchantportaldashboardpagetsx.text_k4qa}</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.merchantportaldashboardpagetsx.text_yftc}</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.merchantportaldashboardpagetsx.text_modk}</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.merchantportaldashboardpagetsx.text_v1jx}</th>
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
                        {deal.isActive ? t.merchantportaldashboardpagetsx.text_2ms3 : t.merchantportaldashboardpagetsx.text_3nmk}
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
                        {t.merchantportaldashboardpagetsx.text_vltw}</Link>
                      <button onClick={() => deleteDeal(deal.id)} className="text-red-600 hover:text-red-900">
                        {t.merchantportaldashboardpagetsx.text_wwfl}</button>
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
