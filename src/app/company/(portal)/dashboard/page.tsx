"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalInternships: 0, totalApplicants: 0, pendingReview: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/company/dashboard");
        if (res.status === 401) {
          router.push("/company/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة البيانات</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">نظرة عامة على فرص التدريب والمتقدمين</p>
        </div>
        <Link
          href="/company/internships"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
        >
          <span>➕</span>
          نشر فرصة تدريب جديدة
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
              📋
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">فرص التدريب المنشورة</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalInternships}</h3>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl">
              👥
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المتقدمين</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalApplicants}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-2xl">
              ⏳
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">طلبات قيد المراجعة</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingReview}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
