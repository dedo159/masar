"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: "",
    recruiterName: "",
    email: "",
    password: "",
    website: "",
    industry: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.companyName.trim() || !formData.recruiterName.trim()) {
      setError(language === "en" ? "Please fill in all required fields." : "يرجى تعبئة جميع الحقول الإلزامية.");
      return;
    }

    if (!formData.email.trim().includes("@")) {
      setError(language === "en" ? "Please enter a valid email address." : "يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    if (formData.password.length < 4) {
      setError(language === "en" ? "Password must be at least 4 characters." : "كلمة المرور يجب أن تكون 4 خانات على الأقل.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/company/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || (language === "en" ? "Failed to create account" : "حدث خطأ أثناء إنشاء الحساب"));
      }

      setSuccess(
        language === "en"
          ? "Company account registered successfully! Redirecting..."
          : "تم إنشاء حساب الشركة بنجاح! جاري الانتقال للوحة التحكم..."
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("masar_company_name", formData.companyName);
        localStorage.setItem("masar_recruiter_name", formData.recruiterName);
      }

      setTimeout(() => {
        router.push("/company/dashboard");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Language switcher button */}
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

      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <MasarLogo size="lg" priority />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Building2 className="h-3.5 w-3.5" />
            <span>
              {language === "en" ? "Company Registration" : "تسجيل شركة شريكة"}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {language === "en" ? "Register New Company" : "تسجيل شركة جديدة — مسار"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {language === "en"
              ? "Create your partner company account to post internships and hire top graduates"
              : "أنشئ حساباً لشركتك للبدء بنشر فرص التدريب واستقطاب نخبة الخريجين"}
          </p>
        </div>

        {/* Card */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                {language === "en" ? "Company Name *" : "اسم الشركة *"}
              </label>
              <Input
                type="text"
                name="companyName"
                required
                className="min-h-[44px]"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={language === "en" ? "e.g. Acme Tech" : "مثال: شركة التقنية الحديثة"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                {language === "en" ? "Recruiter / Contact Name *" : "اسم مسؤول التوظيف *"}
              </label>
              <Input
                type="text"
                name="recruiterName"
                required
                className="min-h-[44px]"
                value={formData.recruiterName}
                onChange={handleChange}
                placeholder={language === "en" ? "e.g. Sarah Jenkins" : "مثال: م. سارة أحمد"}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {language === "en" ? "Work Email Address *" : "البريد الإلكتروني للعمل *"}
            </label>
            <Input
              type="email"
              name="email"
              required
              className="min-h-[44px] text-xs font-mono"
              dir="ltr"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {language === "en" ? "Password *" : "كلمة المرور *"}
            </label>
            <Input
              type="password"
              name="password"
              required
              className="min-h-[44px] font-mono"
              dir="ltr"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  {language === "en" ? "Website" : "الموقع الإلكتروني"}
                </label>
                <span className="text-[10px] text-muted-foreground">{language === "en" ? "Optional" : "اختياري"}</span>
              </div>
              <Input
                type="url"
                name="website"
                className="min-h-[44px] text-xs font-mono"
                dir="ltr"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  {language === "en" ? "Industry" : "مجال العمل"}
                </label>
                <span className="text-[10px] text-muted-foreground">{language === "en" ? "Optional" : "اختياري"}</span>
              </div>
              <Input
                type="text"
                name="industry"
                className="min-h-[44px]"
                value={formData.industry}
                onChange={handleChange}
                placeholder={language === "en" ? "e.g. Software, Finance" : "مثال: تقنية المعلومات"}
              />
            </div>
          </div>

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
                <span>{language === "en" ? "Creating Account..." : "جاري إنشاء الحساب..."}</span>
              </>
            ) : (
              language === "en" ? "Create Company Account" : "إنشاء حساب شركة"
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            {language === "en" ? "Already registered? " : "لديك حساب بالفعل؟ "}
            <Link
              href="/company/login"
              className="text-primary hover:underline font-semibold"
            >
              {language === "en" ? "Sign In" : "تسجيل الدخول"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
