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
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ScanLine,
  KeyRound,
  Store,
  ChevronLeft,
  Info,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MasarLogo } from "@/components/ui/logo";
import { ThemeLanguageToggle } from "@/components/ui/theme-language-toggle";

export default function MerchantLoginPage() {
  const router = useRouter();

  // Mode: 'credentials' (default) or 'pin' (cashier POS quick-access)
  const [authMode, setAuthMode] = useState<"credentials" | "pin">("credentials");

  const [formData, setFormData] = useState({
    contactEmail: "",
    password: "",
  });
  const [pinCode, setPinCode] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-focus next PIN box
  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newPin = [...pinCode];
    newPin[index] = val;
    setPinCode(newPin);

    // If typed a digit, focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinCode[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authMode === "pin") {
      const fullPin = pinCode.join("");
      if (fullPin.length < 4) {
        setError("يرجى إدخال رمز PIN المكون من 4 أرقام كاملاً");
        setLoading(false);
        return;
      }

      // 1. Check registered cashiers from settings/localStorage
      let cashierName = "كاشير 1 (الرئيسي)";
      let cashierBranch = "فرع الجامعة الأردنية — مجمّع العلوم والطب";
      let isCashierActive = true;
      let isFound = false;

      if (typeof window !== "undefined") {
        const savedCashiers = localStorage.getItem("masar_cashiers");
        if (savedCashiers) {
          try {
            const list = JSON.parse(savedCashiers);
            const match = list.find((c: { pin: string; name: string; branchName: string; active: boolean }) => c.pin === fullPin);
            if (match) {
              isFound = true;
              cashierName = match.name;
              cashierBranch = match.branchName;
              isCashierActive = match.active;
            }
          } catch {}
        }
      }

      // Default fallback PINs if not in localStorage
      if (!isFound) {
        if (fullPin === "1234") {
          isFound = true;
          cashierName = "كاشير 1 (الرئيسي — مجمّع العلوم والطب)";
          cashierBranch = "فرع الجامعة الأردنية — مجمّع العلوم والطب";
        } else if (fullPin === "5821") {
          isFound = true;
          cashierName = "كاشير صالة الطلبة (عمان الأهلية)";
          cashierBranch = "فرع جامعة عمان الأهلية — مجمع الخدمات";
        } else if (fullPin === "9043") {
          isFound = true;
          cashierName = "كاشير نقطة بيع إربد (JUST)";
          cashierBranch = "فرع جامعة العلوم والتكنولوجيا (JUST) — المجمّع التجاري";
        }
      }

      if (isFound && !isCashierActive) {
        setError("⚠️ حساب هذا الكاشير معطل حالياً من قِبل إدارة المتجر");
        setLoading(false);
        return;
      }

      // Cashier Quick-Access PIN validation
      try {
        const res = await fetch("/api/merchant/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isCashierPin: true,
            pin: fullPin,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          setSuccess(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("masar_merchant_role", "cashier");
            localStorage.setItem("masar_merchant_email", "shawarma@aldiaa.jo");
            localStorage.setItem("masar_cashier_name", cashierName);
            localStorage.setItem("masar_cashier_branch", cashierBranch);
            localStorage.setItem("masar_cashier_pin", fullPin);
          }
          setTimeout(() => {
            router.push("/merchant/cashier");
            router.refresh();
          }, 600);
        } else {
          setError(data.error || "رمز PIN للفرع غير صحيح، يرجى مراجعة إدارة المتجر");
        }
      } catch {
        setError("تعذر الاتصال بخادم نقطة البيع");
      } finally {
        setLoading(false);
      }
      return;
    }

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
        if (typeof window !== "undefined") {
          localStorage.setItem("masar_merchant_role", "admin");
          if (rememberDevice) {
            localStorage.setItem("masar_merchant_email", formData.contactEmail);
          }
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
    setAuthMode("credentials");
    setFormData({
      contactEmail: "shawarma@aldiaa.jo",
      password: "password123",
    });
    setError("");
  };

  const fillDemoPin = () => {
    setAuthMode("pin");
    setPinCode(["1", "2", "3", "4"]);
    setError("");
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-background text-foreground flex flex-col justify-between items-center p-4 sm:p-8 overflow-hidden select-none font-sans"
    >
      {/* Background Engineering Grids & Radial Accents (Linear / Vercel style) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Ambient Top Glow in Deep Emerald & Amber */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Hairline Ambient Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* 2. عناصر الهيدر والعلامة التجارية */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pb-6 sm:pb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <MasarLogo size="sm" priority />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              مسار للشركاء والمتاجر
            </span>
            <span className="text-[10px] text-muted-foreground">بوابة نقاط البيع والعروض</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeLanguageToggle size="sm" />
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background/50 hover:bg-muted/40 text-xs text-muted-foreground hover:text-foreground transition-all"
          >
            <span>بوابة الطالب</span>
            <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>
      </header>

      {/* 3. بطاقة ونموذج تسجيل الدخول (Login Form Card) */}
      <main className="relative z-10 w-full max-w-[440px] my-auto space-y-4">
        <div className="text-center flex justify-center">
          <MasarLogo size="lg" priority />
        </div>
        <div className="relative rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-xl p-6 sm:p-8 overflow-hidden">
          {/* Top glowing hairline border on card */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

          {/* Quick Demo Helper Bar */}
          <div className="flex items-center justify-between mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/40 text-[10px] font-mono text-muted-foreground">
              <Store className="h-3 w-3 text-amber-500" />
              <span>نظام نقاط البيع والخصومات</span>
            </span>

            <button
              type="button"
              onClick={authMode === "credentials" ? fillDemoAccount : fillDemoPin}
              className="text-[11px] text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-medium hover:underline cursor-pointer"
              title="تعبئة بيانات تجريبية سريعة"
            >
              <Sparkles className="h-3 w-3" />
              <span>{authMode === "credentials" ? "حساب تجريبي (شاورما الضيعة)" : "PIN تجريبي (1234)"}</span>
            </button>
          </div>

          {/* Mode Tabs: Full Merchant vs Cashier POS */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60 mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode("credentials");
                setError("");
              }}
              className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                authMode === "credentials"
                  ? "bg-card text-foreground shadow-sm border border-border font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>حساب التاجر الكامل</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("pin");
                setError("");
              }}
              className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                authMode === "pin"
                  ? "bg-card text-foreground shadow-sm border border-border font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ScanLine className="h-3.5 w-3.5 text-amber-500" />
              <span>نقطة البيع (POS PIN)</span>
            </button>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-start mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {authMode === "credentials" ? "تسجيل الدخول للمتجر" : "الدخول السريع للكاشير"}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {authMode === "credentials"
                ? "أدر العروض والخصومات الطلابية الحصرية وتابع مؤشرات الأداء والمبيعات."
                : "أدخل رمز PIN المخصص لنقطة البيع لبدء مسح وقبول كوبونات الطلاب فورياً."}
            </p>
          </div>

          {/* 5. معالجة التنبيهات والأخطاء */}
          {error && (
            <div className="mb-5 border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>تم تسجيل الدخول بنجاح! جاري التوجيه إلى البوابة...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "credentials" ? (
              <>
                {/* Email Field */}
                <div className="space-y-1.5 text-start">
                  <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-emerald-500" />
                    <span>البريد الإلكتروني للفرع / النشاط التجاري</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      placeholder="store@example.jo"
                      className="w-full h-11 px-3.5 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, contactEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 text-start">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-500" />
                      <span>كلمة المرور</span>
                    </label>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("يرجى التواصل مع الدعم الفني أو البريد المسجل لإعادة ضبط كلمة المرور: support@masar.jo");
                      }}
                      className="text-[11px] text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="w-full h-11 px-3.5 py-2 pl-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
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

                {/* Remember POS device */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded border-border bg-background text-emerald-500 accent-emerald-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>تذكر هذا الجهاز / نقطة البيع (POS)</span>
                  </label>
                </div>
              </>
            ) : (
              /* PIN Mode for Cashier */
              <div className="space-y-4 py-2">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <label className="text-xs font-medium text-foreground/80">
                    رمز PIN للفرع (Branch PIN Code)
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    أدخل الرمز الرباعي الممنوح للكاشير لفتح شاشة فحص العروض
                  </p>
                </div>

                {/* 4-digit PIN Inputs */}
                <div className="flex justify-center gap-3 py-2" dir="ltr">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`pin-input-${index}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={pinCode[index]}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border border-border bg-background text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button (bg-emerald-600) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === "credentials"
                        ? "تسجيل الدخول لبوابة الشركاء"
                        : "دخول نقطة البيع السريعة"}
                    </span>
                    <ChevronLeft className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 4. بطاقة التحقق السريع لنقاط البيع (Cashier Quick-Access Banner) */}
          <div className="mt-6 pt-5 border-t border-border">
            <div
              onClick={() => {
                setAuthMode(authMode === "credentials" ? "pin" : "credentials");
                setError("");
              }}
              className="p-3.5 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.08] to-transparent hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <QrCode className="h-4 w-4" />
                </div>
                <div className="text-start">
                  <p className="text-xs font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {authMode === "credentials"
                      ? "تسجيل دخول سريع لنقاط البيع عبر رمز PIN للفرع"
                      : "العودة لتسجيل الدخول ببيانات الحساب الكاملة"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {authMode === "credentials"
                      ? "دخول مخصص للكاشير ومسح الكوبونات دون صلاحيات الإدارة"
                      : "الوصول لكافة لوحات التحكم والتقارير المالية للتاجر"}
                  </p>
                </div>
              </div>
              <ChevronLeft className="h-4 w-4 text-emerald-400 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </div>

      </main>

      {/* 5. تذييل الصفحة (Footer) */}
      <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-[11px] text-muted-foreground border-t border-border">
        <div className="flex items-center gap-2 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>بوابة الشركاء — مسار</span>
          <span className="text-slate-600">•</span>
          <span>© 2026 مسار. كافة الحقوق محفوظة.</span>
        </div>

        <div>
          <Link
            href="/merchant/register"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 hover:underline"
          >
            <span>هل تريد تسجيل متجرك كشريك تجاري؟ قدم طلبك الآن</span>
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
