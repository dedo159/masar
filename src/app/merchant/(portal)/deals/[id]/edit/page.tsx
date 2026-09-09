"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    discountLabel: "",
    description: "",
    termsConditions: "",
    validUntil: "",
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await fetch(`/api/merchant/deals/${id}`);
        const data = await res.json();
        if (data.deal) {
          const deal = data.deal;
          setFormData({
            title: deal.title || "",
            discountLabel: deal.discountLabel || "",
            description: deal.description || "",
            termsConditions: deal.termsConditions || "",
            validUntil: deal.validUntil ? new Date(deal.validUntil).toISOString().split('T')[0] : "",
            isActive: deal.isActive,
          });
        } else {
          setError("العرض غير موجود");
        }
      } catch (err) {
        setError("تعذر جلب البيانات");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/merchant/deals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        data = { error: "حدث خطأ غير متوقع" };
      }

      if (res.ok && data.success) {
        router.push("/merchant/dashboard");
      } else {
        setError(data.error || "فشل تحديث العرض");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">تعديل العرض</h2>
        <Link href="/merchant/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          إلغاء
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عنوان العرض
          </label>
          <input
            required
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نسبة أو نوع الخصم
          </label>
          <input
            required
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={formData.discountLabel}
            onChange={(e) => setFormData({ ...formData, discountLabel: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وصف العرض
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الشروط والأحكام
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            rows={2}
            value={formData.termsConditions}
            onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تاريخ الانتهاء
          </label>
          <input
            required
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
            العرض نشط
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}
