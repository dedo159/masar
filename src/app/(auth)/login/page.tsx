"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const universities = [
  { id: "aau", name: "جامعة عمان العربية", moodleUrl: "https://vclass.ammanu.edu.jo" },
  { id: "ju", name: "الجامعة الأردنية", moodleUrl: "https://elearning.ju.edu.jo/moodle" },
  { id: "just", name: "جامعة العلوم والتكنولوجيا الأردنية", moodleUrl: "https://elearn.just.edu.jo" },
  { id: "yu", name: "جامعة اليرموك", moodleUrl: "https://elearning.yu.edu.jo" },
  { id: "gju", name: "الجامعة الألمانية الأردنية", moodleUrl: "https://lms.gju.edu.jo" },
  { id: "bau", name: "جامعة البلقاء التطبيقية", moodleUrl: "https://elearning.bau.edu.jo" },
  { id: "pu", name: "جامعة البترا", moodleUrl: "https://elearning.uop.edu.jo" },
  { id: "ahu", name: "جامعة الحسين التقنية", moodleUrl: "https://lms.htu.edu.jo" },
  { id: "mut", name: "جامعة آل البيت", moodleUrl: "https://elearning.aabu.edu.jo" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedUniv, setSelectedUniv] = useState("aau");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedUniv) {
      setError("يرجى اختيار جامعتك أولاً.");
      return;
    }
    if (!username.trim()) {
      setError("يرجى إدخال اسم المستخدم أو الرقم الجامعي.");
      return;
    }
    if (!password) {
      setError("يرجى إدخال كلمة المرور.");
      return;
    }

    const univ = universities.find((u) => u.id === selectedUniv);
    const moodleUrl = univ?.moodleUrl || "https://vclass.ammanu.edu.jo";

    setLoading(true);
    try {
      const res = await fetch("/api/moodle-test/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodleUrl,
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "فشل تسجيل الدخول. تأكد من صحة البيانات.");
        setLoading(false);
        return;
      }

      setSuccess("تم تسجيل الدخول بنجاح! جاري تحويلك...");
      
      if (typeof window !== "undefined") {
        localStorage.setItem("masar_logged_in", "true");
        localStorage.setItem("masar_user_name", data.student?.name || username);
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary mb-4">
            <span className="text-primary-foreground text-xl font-medium">م</span>
          </div>
          <h1 className="text-2xl font-medium">مسار</h1>
          <p className="text-sm text-muted-foreground mt-1">
            نظام التشغيل الرقمي لحياتك الجامعية
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
        >
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 text-destructive text-xs leading-relaxed border border-destructive/20">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              اختر جامعتك
            </label>
            <select
              value={selectedUniv}
              onChange={(e) => setSelectedUniv(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="">ابحث عن جامعتك...</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              اسم المستخدم (Moodle)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="أدخل اسم المستخدم أو الرقم الجامعي"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>

          <div className="pt-1 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-block"
            >
              أو الدخول كطالب تجريبي (Demo) ←
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-1">
            كلمة مرورك تُستخدم مرة واحدة فقط لتوليد رمز الدخول — لا تُخزَّن.
          </p>
        </form>
      </div>
    </div>
  );
}
