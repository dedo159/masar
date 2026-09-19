"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Tag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";

export default function MerchantRegisterPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    category: "مطاعم",
    contactEmail: "",
    password: "",
    logoUrl: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/merchant/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "حدث خطأ غير متوقع في معالجة البيانات" };
      }

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/merchant/dashboard");
          router.refresh();
        }, 800);
      } else {
        setError(data.error || "فشل تسجيل المتجر، يرجى مراجعة البيانات المدخلة");
      }
    } catch {
      setError("تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت والمحاولة ثانية");
    } finally {
      setLoading(false);
    }
  };

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-background text-foreground flex flex-col justify-between items-center p-4 sm:p-8 overflow-hidden select-none transition-colors duration-200"
    >
      {/* Vercel Ambient Spotlight & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] sm:w-[860px] h-[360px] bg-gradient-to-b from-foreground/[0.07] via-foreground/[0.02] to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pb-6 sm:pb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <MasarLogo size="sm" priority />
            <div className="flex flex-col text-start">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-foreground">مسار</span>
                <span className="text-xs text-muted-foreground font-mono">/ الشركاء</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/merchant/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-secondary/60 inline-flex items-center gap-1"
          >
            <span>لديك حساب؟ تسجيل الدخول</span>
            <ArrowRight className="h-3 w-3 rotate-180" />
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              type="button"
              className="w-9 h-9 rounded-lg border border-border/70 bg-card/60 hover:bg-accent/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="تبديل المظهر"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-[460px] my-auto space-y-4">
        <div className="text-center flex justify-center">
          <MasarLogo size="lg" priority />
        </div>
        <div className="relative rounded-2xl border border-border/80 bg-card/75 dark:bg-[#070707]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />

          {/* Vercel style mono badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono text-muted-foreground tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEW PARTNER ONBOARDING · مسار</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-start mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              تسجيل شريك تجاري جديد
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              انضم لشبكة شركاء مسار وقدم عروضك الحصرية لآلاف طلاب الجامعات مباشرة.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 border border-destructive/30 bg-destructive/10 text-destructive text-xs p-3 rounded-lg flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>تم إنشاء حساب المتجر بنجاح! جاري التوجيه إلى لوحة التحكم...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Business Name */}
            <div className="space-y-1 text-start">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5" />
                <span>اسم المتجر أو العلامة التجارية</span>
              </label>
              <Input
                required
                type="text"
                placeholder="مثال: مطعم شاورما الضيعة"
                className="h-10 text-xs bg-background/60 border-border focus-visible:ring-1 focus-visible:ring-foreground"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
            </div>

            {/* Category Selector */}
            <div className="space-y-1 text-start">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                <span>تصنيف النشاط التجاري</span>
              </label>
              <select
                className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background/60 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer font-sans"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="مطاعم">🍔 مطاعم ومقاهي</option>
                <option value="مكتبات">📚 مكتبات وقرطاسية</option>
                <option value="مواصلات">🚌 مواصلات ونقل</option>
                <option value="متاجر">🛍️ متاجر وتجزئة</option>
                <option value="كورسات">💻 كورسات وتدريب</option>
                <option value="أخرى">🏷️ أخرى</option>
              </select>
            </div>

            {/* Email Field */}
            <div className="space-y-1 text-start">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>البريد الإلكتروني للعمل</span>
              </label>
              <Input
                required
                type="email"
                placeholder="partner@store.jo"
                className="h-10 text-xs font-mono bg-background/60 border-border focus-visible:ring-1 focus-visible:ring-foreground"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-start">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span>كلمة المرور</span>
              </label>
              <div className="relative">
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="h-10 text-xs font-mono bg-background/60 border-border focus-visible:ring-1 focus-visible:ring-foreground pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
                  tabIndex={-1}
                  aria-label="إظهار/إخفاء كلمة المرور"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Optional Logo URL */}
            <div className="space-y-1 text-start">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                <span>رابط شعار المتجر (اختياري)</span>
              </label>
              <Input
                type="url"
                placeholder="https://example.com/logo.png"
                className="h-10 text-xs font-mono bg-background/60 border-border focus-visible:ring-1 focus-visible:ring-foreground"
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, logoUrl: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-10 rounded-lg bg-foreground text-background hover:opacity-90 active:scale-[0.99] font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>جاري تسجيل الشريك...</span>
                  </>
                ) : (
                  <>
                    <span>إنشاء حساب المتجر</span>
                    <span className="font-mono text-[11px] opacity-70">↵</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-card px-2 text-muted-foreground">
                لديك متجر مسجل مسبقاً؟
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div>
            <Link href="/merchant/login">
              <Button
                variant="outline"
                className="w-full h-10 rounded-lg border-border/80 bg-background/40 hover:bg-accent/60 text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>العودة لتسجيل الدخول</span>
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[11px] text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-2 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>بوابة الشركاء — مسار</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span>© 2026 مسار. كافة الحقوق محفوظة.</span>
        </div>
      </footer>
    </div>
  );
}
