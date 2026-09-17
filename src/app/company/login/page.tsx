"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";

export default function CompanyLoginPage() {
  const router = useRouter();
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Realtime field validation indicators
  const isEmailValid = email.trim().length >= 5 && email.includes("@");
  const isPasswordValid = password.length >= 4;

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isEmailValid) {
      setError(language === "en" ? "Please enter a valid work email address." : "يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    if (!isPasswordValid) {
      setError(language === "en" ? "Password must be at least 4 characters." : "كلمة المرور يجب أن تكون 4 خانات على الأقل.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/company/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || !data.success) {
        setError(
          data.error ||
          (language === "en"
            ? "Invalid email or password"
            : "البريد الإلكتروني أو كلمة المرور غير صحيحة")
        );
        setLoading(false);
        return;
      }

      setSuccess(
        language === "en"
          ? `Welcome back, ${data.name || "Partner"}! Redirecting to dashboard...`
          : `أهلاً بك مجدداً، ${data.name || "شريكنا"}! جاري التحويل إلى لوحة التحكم...`
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("masar_company_name", data.company || "");
        localStorage.setItem("masar_recruiter_name", data.name || "");
      }

      setTimeout(() => {
        router.push("/company/dashboard");
        router.refresh();
      }, 900);
    } catch {
      setError(
        language === "en"
          ? "Network connection error. Please try again."
          : "حدث خطأ في الاتصال بالشبكة، يرجى المحاولة لاحقاً."
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Language switcher button in header */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <button
          onClick={toggleLanguage}
          type="button"
          aria-label={t.header.toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{language === "ar" ? "English" : "العربية"}</span>
        </button>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <MasarLogo size="lg" priority />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Building2 className="h-3.5 w-3.5" />
            <span>
              {language === "en" ? "Company & Recruiter Portal" : "بوابة الشركات وجهات التدريب"}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {language === "en" ? "Sign in to Masar" : "بوابة الشركات — مسار"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {language === "en"
              ? "Manage internship opportunities and connect with top university talent"
              : "قم بتسجيل الدخول لإدارة فرص التدريب ومتابعة المتقدمين"}
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

          {/* Work Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {language === "en" ? "Work Email Address" : "البريد الإلكتروني للعمل"}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="name@company.com"
              className="min-h-[44px] text-xs font-mono"
              dir="ltr"
              required
              error={Boolean(error && !isEmailValid)}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                {language === "en" ? "Password" : "كلمة المرور"}
              </label>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="min-h-[44px] font-mono"
              dir="ltr"
              required
              error={Boolean(error && !isPasswordValid)}
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>{language === "en" ? "Remember me" : "تذكرني"}</span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="default"
            size="default"
            className="w-full min-h-[44px] text-sm font-semibold gap-2 mt-2 cursor-pointer active:scale-98 transition-transform"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{language === "en" ? "Signing in..." : "جاري تسجيل الدخول..."}</span>
              </>
            ) : (
              language === "en" ? "Sign In" : "تسجيل الدخول"
            )}
          </Button>

          {/* Register Link */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            {language === "en" ? "Don't have a company account? " : "ليس لديك حساب شركة؟ "}
            <Link
              href="/company/register"
              className="text-primary hover:underline font-semibold"
            >
              {language === "en" ? "Register new company" : "سجل كشركة جديدة"}
            </Link>
          </div>

          {/* Security Notice & Other Portals */}
          <div className="pt-3 border-t border-border space-y-2">
            <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
              {language === "en"
                ? "Protected by Masar enterprise security. Student and applicant records are strictly verified."
                : "محمي بنظام أمان مسار للمؤسسات. بيانات المتقدمين وسجلاتهم موثقة ومعزولة بالكامل."}
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
              <Link href="/login" className="hover:text-foreground hover:underline transition-colors">
                {language === "en" ? "Student Portal" : "بوابة الطلاب"}
              </Link>
              <span>•</span>
              <Link href="/university/login" className="hover:text-foreground hover:underline transition-colors">
                {language === "en" ? "University Portal" : "بوابة الجامعة"}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
