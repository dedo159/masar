"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InternshipsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "onsite",
    duration: "",
    deadline: "",
    tags: "",
    applyUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/company/internships");
      if (res.status === 401) {
        router.push("/company/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/company/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", location: "", type: "onsite", duration: "", deadline: "", tags: "", applyUrl: "", description: "" });
        fetchInternships();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفرصة؟")) return;
    try {
      const res = await fetch(`/api/company/internships/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInternships(internships.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">فرص التدريب</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة فرص التدريب المنشورة من قبل شركتك</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
        >
          <span>➕</span>
          نشر فرصة جديدة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : internships.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <span className="text-4xl mb-3 inline-block">💼</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">لا توجد فرص تدريب</h3>
          <p className="text-gray-500 mt-1">قم بنشر أول فرصة تدريب لشركتك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <div key={internship.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">{internship.title}</h3>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  {internship.type === 'remote' ? 'عن بعد' : internship.type === 'hybrid' ? 'مدمج' : 'حضوري'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2">
                  <span>📍</span> {internship.location}
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span> {internship.duration}
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span> {internship._count?.applications || 0} متقدم
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href={`/company/internships/${internship.id}/applicants`}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 py-2 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  عرض المتقدمين
                </Link>
                <button
                  onClick={() => handleDelete(internship.id)}
                  className="px-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg text-sm transition-colors"
                  title="حذف"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">نشر فرصة تدريب جديدة</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المسمى الوظيفي *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموقع *</label>
                  <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع التدريب</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="onsite">حضوري</option>
                    <option value="remote">عن بعد</option>
                    <option value="hybrid">مدمج</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المدة *</label>
                  <input required name="duration" value={formData.duration} onChange={handleChange} placeholder="مثال: 3 أشهر" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">آخر موعد للتقديم</label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الكلمات المفتاحية (مفصولة بفاصلة)</label>
                <input name="tags" value={formData.tags} onChange={handleChange} placeholder="مثال: React, Node.js, برمجة" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط التقديم الخارجي (اختياري)</label>
                <input type="url" name="applyUrl" value={formData.applyUrl} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70">
                  {submitting ? "جاري الحفظ..." : "نشر الفرصة"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
