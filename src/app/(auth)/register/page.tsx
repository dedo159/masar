"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const universities = [
  { id: "aau", nameAr: "جامعة عمان الأهلية", nameEn: "Al-Ahliyya Amman University", moodleUrl: "https://vclass.ammanu.edu.jo" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [selectedUniv, setSelectedUniv] = useState("aau");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Realtime field validation indicators
  const isNameValid = name.trim().length >= 3;
  const isStudentIdValid = studentId.trim().length >= 3;
  const isPasswordValid = password.length >= 6;

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isNameValid) {
      setError(language === "en" ? "Please enter your full name (at least 3 characters)" : "يرجى إدخال اسمك الكامل (3 أحرف على الأقل)");
      return;
    }
    if (!isStudentIdValid) {
      setError(language === "en" ? "Please enter your academic student ID" : "يرجى إدخال رقمك الجامعي بشكل صحيح");
      return;
    }
    if (!isPasswordValid) {
      setError(language === "en" ? "Password must be at least 6 characters" : "كلمة المرور يجب أن تتكون من 6 خانات على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/student/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          studentId: studentId.trim(),
          email: email.trim() || undefined,
          password,
          universityCode: selectedUniv,
          major: major.trim() || undefined,
        }),
      });

      let data: Record<string, any> = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || !data.success) {
        setError(data.error || (language === "en" ? "Failed to create account" : "فشل إنشاء الحساب"));
        setLoading(false);
        return;
      }

      setSuccess(language === "en" ? "Account created successfully! Redirecting..." : "تم إنشاء حسابك بنجاح! جاري تحويلك...");

      if (typeof window !== "undefined") {
        localStorage.setItem("masar_logged_in", "true");
        localStorage.setItem("masar_user_name", data.student?.name || name);
        if (data.student?.major) {
          localStorage.setItem("masar_user_major", data.student.major);
        }
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch {
      setError(t.auth.networkError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* Theme switcher in header */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <MasarLogo size="lg" priority />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {language === "en" ? "Create Student Account" : "إنشاء حساب طالب جديد"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {language === "en" ? "Register your account to access your personalized dashboard" : "سجّل حسابك للوصول إلى لوحة بياناتك الخاصة ومتابعة دراستك"}
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-card p-6 space-y-4 shadow-sm"
        >
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-destructive/10 text-destructive text-xs leading-relaxed border border-destructive/20">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Student Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {language === "en" ? "Full Name" : "الاسم الكامل"}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder={language === "en" ? "e.g. Omar Al-Ahmad" : "مثال: عمر الأحمد"}
              className="min-h-[44px]"
              error={Boolean(error && !isNameValid)}
            />
          </div>

          {/* Academic Student ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {language === "en" ? "Academic Student ID" : "الرقم الجامعي"}
            </label>
            <Input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={loading}
              placeholder={language === "en" ? "e.g. 202610101" : "مثال: 202610101"}
              className="min-h-[44px] text-xs font-mono"
              dir="ltr"
              error={Boolean(error && !isStudentIdValid)}
            />
          </div>

          {/* University selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {t.auth.selectUniversity}
            </label>
            <div className="relative">
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                disabled={loading}
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground cursor-pointer"
              >
                <option value="">{language === "en" ? "Select your university..." : "اختر جامعتك..."}</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {language === "en" ? u.nameEn : u.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {t.auth.password}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder={language === "en" ? "At least 6 characters" : "6 خانات على الأقل"}
              className="min-h-[44px] font-mono"
              dir="ltr"
              error={Boolean(error && !isPasswordValid)}
            />
          </div>

          {/* Major (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                {t.auth.majorPlaceholder}
              </label>
              <span className="text-[10px] text-muted-foreground">{language === "en" ? "Optional" : "اختياري"}</span>
            </div>
            <Input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              disabled={loading}
              placeholder={language === "en" ? "e.g. Software Engineering, CS" : "مثال: هندسة البرمجيات، علم الحاسوب"}
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
                <span>{language === "en" ? "Creating Account..." : "جاري إنشاء الحساب..."}</span>
              </>
            ) : (
              language === "en" ? "Create Account" : "إنشاء الحساب والمتابعة"
            )}
          </Button>

          {/* Login Link */}
          <div className="pt-2 text-center space-y-1">
            <Link
              href="/login"
              className="text-xs text-primary hover:underline font-medium p-1 block"
            >
              {language === "en" ? "Already have an account? Log In →" : "لديك حساب بالفعل؟ تسجيل الدخول ←"}
            </Link>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors p-1 block"
            >
              {language === "en" ? "Or enter as Demo Student →" : "أو الدخول كطالب تجريبي (Demo) ←"}
            </Link>
          </div>

          {/* Security Notice */}
          <p className="text-center text-[11px] text-muted-foreground pt-1 leading-relaxed border-t border-border">
            {t.auth.privacyNotice}
          </p>
        </form>
      </div>
    </div>
  );
}

