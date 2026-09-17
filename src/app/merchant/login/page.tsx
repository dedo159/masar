"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MerchantLoginPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    contactEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      const res = await fetch("/api/merchant/auth/login", {
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
        if (typeof window !== "undefined" && rememberMe) {
          localStorage.setItem("masar_merchant_email", formData.contactEmail);
        }
        setTimeout(() => {
          router.push("/merchant/dashboard");
          router.refresh();
        }, 600);
      } else {
        setError(data.error || "بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور");
      }
    } catch {
      setError("تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت والمحاولة ثانية");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setFormData({
      contactEmail: "shawarma@aldiaa.jo",
      password: "password123",
    });
    setError("");
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
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pb-6 sm:pb-10">
        <div className="flex items-center gap-3">
          {/* Vercel-style geometric triangle logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs shadow-sm transition-transform duration-200 group-hover:scale-105">
              ▲
            </div>
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
            href="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-secondary/60 hidden sm:inline-flex items-center gap-1"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="h-3 w-3 rotate-180" />
          </Link>

          {/* Theme Toggle */}
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
      <main className="relative z-10 w-full max-w-[420px] my-auto">
        <div className="relative rounded-2xl border border-border/80 bg-card/75 dark:bg-[#070707]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-300">
          {/* Top glowing hairline accent */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />

          {/* Vercel style mono badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-secondary/50 text-[10px] font-mono text-muted-foreground tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MERCHANT CLOUD · مسار</span>
            </div>

            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 font-mono hover:underline cursor-pointer"
              title="تعبئة بيانات حساب شاورما الضيعة التجريبي للاختبار السريع"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>حساب تجريبي</span>
            </button>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-start mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              تسجيل الدخول للمتجر
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              أدر عروضك وخصوماتك الطلابية الحصرية وتابع عمليات الاستخدام الميداني فورياً.
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
              <span>تم التحقق بنجاح! جاري الانتقال إلى لوحة التحكم...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>البريد الإلكتروني للشركاء</span>
              </label>
              <Input
                required
                type="email"
                placeholder="name@store.jo"
                className="h-10 text-xs font-mono bg-background/60 border-border focus-visible:ring-1 focus-visible:ring-foreground"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-start">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  <span>كلمة المرور</span>
                </label>
              </div>
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border bg-background/50 accent-foreground h-3.5 w-3.5 cursor-pointer"
                />
                <span>تذكر بيانات تسجيل الدخول</span>
              </label>
            </div>

            {/* Vercel Signature Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-10 rounded-lg bg-foreground text-background hover:opacity-90 active:scale-[0.99] font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>جاري التحقق والدخول...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول للمتجر</span>
                    <span className="font-mono text-[11px] opacity-70">↵</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-card px-2 text-muted-foreground">
                شريك جديد في مسار؟
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div>
            <Link href="/merchant/register">
              <Button
                variant="outline"
                className="w-full h-10 rounded-lg border-border/80 bg-background/40 hover:bg-accent/60 text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>انضم كشريك تجاري وأنشئ متجرك</span>
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Security & Academic Trust */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/75 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>جلسة مشفرة بمعايير TLS 1.3 · معتمدة لشبكة الجامعات</span>
        </div>
      </main>

      {/* Vercel Status Footer */}
      <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-[11px] text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-2 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>جميع أنظمة بوابة الشركاء تعمل بكفاءة (All Systems Operational)</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span>MASAR PARTNER CLOUD</span>
          <span className="text-border">•</span>
          <span>EDGE NETWORK</span>
          <span className="text-border">•</span>
          <span>v2.6</span>
        </div>
      </footer>
    </div>
  );
}
