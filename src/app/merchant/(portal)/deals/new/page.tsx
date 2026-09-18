"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, Store, Check, ArrowRight, Sparkles } from "lucide-react";

const availableBranches = [
  { id: "branch-ju", name: "فرع الجامعة الأردنية — مجمّع العلوم والطب", city: "عمان" },
  { id: "branch-aau", name: "فرع جامعة عمان الأهلية — البوابة الرئيسية", city: "السلط" },
  { id: "branch-just", name: "فرع جامعة العلوم والتكنولوجيا (JUST) — المجمّع التجاري", city: "إربد" },
  { id: "branch-yu", name: "فرع جامعة اليرموك — شارع الجامعة", city: "إربد" },
  { id: "branch-bau", name: "فرع جامعة البلقاء التطبيقية — البوابة الرئيسية", city: "السلط" },
];

export default function NewDealPage() {
  const router = useRouter();
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const weekLaterStr = `${weekLater.getFullYear()}-${pad(weekLater.getMonth() + 1)}-${pad(weekLater.getDate())}`;

  const [formData, setFormData] = useState({
    title: "",
    discountLabel: "",
    description: "",
    termsConditions: "",
    startDate: todayStr,
    startTime: currentTimeStr,
    endDate: weekLaterStr,
    endTime: "23:59",
  });

  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    "branch-ju",
    "branch-aau",
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleBranch = (id: string) => {
    setSelectedBranches((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((b) => b !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllBranches = () => {
    if (selectedBranches.length === availableBranches.length) {
      setSelectedBranches([availableBranches[0].id]);
    } else {
      setSelectedBranches(availableBranches.map((b) => b.id));
    }
  };

  // Quick Presets
  const setStartNow = () => {
    const d = new Date();
    setFormData((prev) => ({
      ...prev,
      startDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      startTime: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    }));
  };

  const addHoursToEnd = (hours: number) => {
    const base = new Date(`${formData.startDate}T${formData.startTime}`);
    const validBase = isNaN(base.getTime()) ? new Date() : base;
    const target = new Date(validBase.getTime() + hours * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      endDate: `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`,
      endTime: `${pad(target.getHours())}:${pad(target.getMinutes())}`,
    }));
  };

  const addDaysToEnd = (days: number) => {
    const base = new Date(`${formData.startDate}T${formData.startTime}`);
    const validBase = isNaN(base.getTime()) ? new Date() : base;
    const target = new Date(validBase.getTime() + days * 24 * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      endDate: `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`,
      endTime: "23:59",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const branchNames = availableBranches
        .filter((b) => selectedBranches.includes(b.id))
        .map((b) => b.name)
        .join(" | ");

      const terms = formData.termsConditions
        ? `${formData.termsConditions} (متاح في: ${branchNames})`
        : `متاح في: ${branchNames}`;

      const payload = {
        title: formData.title,
        discountLabel: formData.discountLabel,
        description: formData.description,
        termsConditions: terms,
        validFrom: `${formData.startDate}T${formData.startTime}:00`,
        validUntil: `${formData.endDate}T${formData.endTime}:00`,
      };

      const res = await fetch("/api/merchant/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "حدث خطأ غير متوقع" };
      }

      if (res.ok && data.success) {
        router.push("/merchant/dashboard");
      } else {
        setError(data.error || "فشل إنشاء العرض");
      }
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-card text-card-foreground p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6" dir="rtl">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground">إضافة عرض طلابي جديد</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            حدد تفاصيل الخصم، الفروع المشمولة، ومواعيد البداية والنهاية بالدقيقة.
          </p>
        </div>
        <Link
          href="/merchant/dashboard"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          إلغاء
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3.5 rounded-xl text-xs font-semibold border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            عنوان العرض
          </label>
          <input
            required
            type="text"
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="مثال: خصم 20% على وجبات الغداء العائلية"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            نسبة أو نوع الخصم المعلن
          </label>
          <input
            required
            type="text"
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder="مثال: 20% أو بطاطا ومشروب مجاني"
            value={formData.discountLabel}
            onChange={(e) => setFormData({ ...formData, discountLabel: e.target.value })}
          />
        </div>

        {/* خانة الفروع المشمولة */}
        <div className="space-y-2 p-4 rounded-xl border border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Store className="h-4 w-4 text-primary" />
              <span>الفروع المشمولة بالعرض (يمكنك اختيار أكثر من فرع):</span>
            </label>
            <button
              type="button"
              onClick={handleSelectAllBranches}
              className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
            >
              {selectedBranches.length === availableBranches.length ? "إلغاء تحديد الكل" : "تحديد كافة الفروع"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {availableBranches.map((branch) => {
              const isSelected = selectedBranches.includes(branch.id);
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => toggleBranch(branch.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-primary/10 border-primary/50 text-foreground"
                      : "bg-background border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] shrink-0 ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground font-bold"
                        : "border-muted-foreground/40 bg-card"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <div className="text-xs font-medium truncate">
                    <span>{branch.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            وصف العرض
          </label>
          <textarea
            className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            rows={2}
            placeholder="تفاصيل ومكونات العرض..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            الشروط والأحكام
          </label>
          <textarea
            className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            rows={2}
            placeholder="مثال: يسري العرض عند إبراز تطبيق مسار للطلاب."
            value={formData.termsConditions}
            onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
          />
        </div>

        {/* خانة بداية ونهاية العرض (تاريخ ووقت بنظام سهل الاستخدام) */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">
              توقيت سريان العرض (تاريخ ووقت البداية والنهاية):
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* بداية العرض */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-2 text-right">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>بداية العرض:</span>
                </label>
                <span className="text-[10px] text-muted-foreground font-mono">Start Time</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">التاريخ 📅</span>
                  <input
                    required
                    type="date"
                    className="w-full h-9 px-2 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">الوقت ⏰</span>
                  <input
                    required
                    type="time"
                    className="w-full h-9 px-2 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-1 border-t border-border/60 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">اختصار:</span>
                <button
                  type="button"
                  onClick={setStartNow}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  ⚡ الآن
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, startTime: "12:00" }))}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  🍽️ 12:00 م
                </button>
              </div>
            </div>

            {/* نهاية العرض */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-2 text-right">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>نهاية العرض:</span>
                </label>
                <span className="text-[10px] text-muted-foreground font-mono">End Time</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">التاريخ 📅</span>
                  <input
                    required
                    type="date"
                    min={formData.startDate}
                    className="w-full h-9 px-2 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">الوقت ⏰</span>
                  <input
                    required
                    type="time"
                    className="w-full h-9 px-2 text-xs font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-1 border-t border-border/60 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">إضافة مدة:</span>
                <button
                  type="button"
                  onClick={() => addHoursToEnd(2)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  + ساعتان
                </button>
                <button
                  type="button"
                  onClick={() => addHoursToEnd(4)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  + 4 ساعات
                </button>
                <button
                  type="button"
                  onClick={() => addDaysToEnd(3)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  + 3 أيام
                </button>
                <button
                  type="button"
                  onClick={() => addDaysToEnd(7)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  + أسبوع
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-2.5 px-4 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 cursor-pointer text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? "جاري الحفظ..." : "حفظ ونشر العرض"}
          </button>
        </div>
      </form>
    </div>
  );
}
