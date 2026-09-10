"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Building2, Lock, User, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";

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
  const [major, setMajor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Realtime field validation indicators
  const isUsernameValid = username.trim().length >= 3;
  const isPasswordValid = password.length >= 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedUniv) {
      setError("يرجى اختيار جامعتك أولاً للمتابعة.");
      return;
    }
    if (!isUsernameValid) {
      setError("يرجى إدخال اسم المستخدم أو الرقم الجامعي بشكل صحيح (3 أحرف أو أرقام على الأقل).");
      return;
    }
    if (!isPasswordValid) {
      setError("يرجى إدخال كلمة المرور الخاصة ببوابة Moodle.");
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
          major: major.trim(),
        }),
      });

      let data: Record<string, any> = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || !data.success) {
        setError(data.error || "فشل تسجيل الدخول. يرجى التحقق من الرقم الجامعي وكلمة المرور.");
        setLoading(false);
        return;
      }

      setSuccess("تم تسجيل الدخول والربط بنجاح! جاري تحويلك...");

      if (typeof window !== "undefined") {
        localStorage.setItem("masar_logged_in", "true");
        localStorage.setItem("masar_user_name", data.student?.name || username);
        if (major.trim()) {
          localStorage.setItem("masar_user_major", major.trim());
        }
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground" dir="rtl">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <MasarLogo size="lg" priority />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">مسار</h1>
          <p className="text-xs text-muted-foreground mt-1">
            نظام التشغيل الرقمي المتكامل لحياتك الجامعية
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
        >
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs leading-relaxed border border-destructive/20">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* University selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              اختر جامعتك
            </label>
            <div className="relative">
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                disabled={loading}
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground cursor-pointer"
              >
                <option value="">اختر الجامعة الأردنية التابع لها...</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Username / Student ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              اسم المستخدم أو الرقم الجامعي (Moodle)
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="مثال: 2110456 أو ahmed.k"
              className="min-h-[44px] text-xs font-mono"
              dir="ltr"
              error={Boolean(error && !isUsernameValid)}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              كلمة مرور Moodle
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="min-h-[44px] font-mono"
              dir="ltr"
              error={Boolean(error && !isPasswordValid)}
            />
          </div>

          {/* Major (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                التخصص الجامعي
              </label>
              <span className="text-[10px] text-muted-foreground">اختياري</span>
            </div>
            <Input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              disabled={loading}
              placeholder="مثال: هندسة البرمجيات، علم الحاسوب"
              className="min-h-[44px]"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="default"
            size="default"
            className="w-full min-h-[44px] text-sm font-semibold gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري تسجيل الدخول والمزامنة...</span>
              </>
            ) : (
              "تسجيل الدخول ومزامنة المقررات"
            )}
          </Button>

          {/* Demo Login Link */}
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors p-2 inline-block"
            >
              أو الدخول كطالب تجريبي (Demo) ←
            </Link>
          </div>

          {/* Security Notice */}
          <p className="text-center text-[11px] text-muted-foreground pt-1 leading-relaxed border-t border-border">
            تشفير كامل AES-256: كلمة مرورك لا تُخزّن نهائياً وتُستخدم لمرة واحدة فقط لتوليد جلسة Moodle الآمنة.
          </p>
        </form>
      </div>
    </div>
  );
}
