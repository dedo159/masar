"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<{ internship: any, applications: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`/api/company/internships/${id}/applicants`);
        if (res.status === 401) {
          router.push("/company/login");
          return;
        }
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplicants();
  }, [id, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-medium">مقبول</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-medium">مرفوض</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 px-2.5 py-1 rounded-full text-xs font-medium">قيد المراجعة</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/company/internships" className="text-gray-500 hover:text-emerald-600 transition-colors bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800">
          ➡️
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">المتقدمين لفرصة التدريب</h2>
          {data?.internship && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">{data.internship.title}</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : !data || data.applications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <span className="text-4xl mb-3 inline-block">📭</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">لا يوجد متقدمين بعد</h3>
          <p className="text-gray-500 mt-1">لم يقم أحد بالتقديم على هذه الفرصة حتى الآن</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">اسم الطالب</th>
                  <th className="px-6 py-4">الرقم الجامعي</th>
                  <th className="px-6 py-4">الجامعة</th>
                  <th className="px-6 py-4">التخصص</th>
                  <th className="px-6 py-4">تاريخ التقديم</th>
                  <th className="px-6 py-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {app.student.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {app.student.studentId}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {app.student.university?.name || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {app.student.major}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
