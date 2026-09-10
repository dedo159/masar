"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";

const universities = [
  { id: "aau", nameAr: "جامعة عمان العربية", nameEn: "Amman Arab University", moodleUrl: "https://vclass.ammanu.edu.jo" },
  { id: "ju", nameAr: "الجامعة الأردنية", nameEn: "University of Jordan", moodleUrl: "https://elearning.ju.edu.jo/moodle" },
  { id: "just", nameAr: "جامعة العلوم والتكنولوجيا الأردنية", nameEn: "JUST", moodleUrl: "https://elearn.just.edu.jo" },
  { id: "yu", nameAr: "جامعة اليرموك", nameEn: "Yarmouk University", moodleUrl: "https://elearning.yu.edu.jo" },
  { id: "gju", nameAr: "الجامعة الألمانية الأردنية", nameEn: "German Jordanian University", moodleUrl: "https://lms.gju.edu.jo" },
  { id: "bau", nameAr: "جامعة البلقاء التطبيقية", nameEn: "Al-Balqa Applied University", moodleUrl: "https://elearning.bau.edu.jo" },
  { id: "pu", nameAr: "جامعة البترا", nameEn: "University of Petra", moodleUrl: "https://elearning.uop.edu.jo" },
  { id: "ahu", nameAr: "جامعة الحسين التقنية", nameEn: "Al Hussein Technical University", moodleUrl: "https://lms.htu.edu.jo" },
  { id: "mut", nameAr: "جامعة آل البيت", nameEn: "Al al-Bayt University", moodleUrl: "https://elearning.aabu.edu.jo" },
];

export default function LoginPage() {
  const router = useRouter();
  const { t, isRtl, language, setLanguage } = useLanguage();
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

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedUniv) {
      setError(t.auth.invalidUniv);
      return;
    }
    if (!isUsernameValid) {
      setError(t.auth.invalidUsername);
      return;
    }
    if (!isPasswordValid) {
      setError(t.auth.invalidPassword);
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
        setError(data.error || t.auth.loginFailed);
        setLoading(false);
        return;
      }

      setSuccess(t.auth.loginSuccess);

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
      setError(t.auth.networkError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* Language switcher button in header */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <button
          onClick={toggleLanguage}
          type="button"
          aria-label={t.header.toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 text-xs font-semibold hover:bg-secondary transition-colors"
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.auth.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.auth.subtitle}
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
              {t.auth.selectUniversity}
            </label>
            <div className="relative">
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                disabled={loading}
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground cursor-pointer"
              >
                <option value="">{language === "en" ? "Select your Jordanian university..." : "اختر الجامعة الأردنية التابع لها..."}</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {language === "en" ? u.nameEn : u.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Username / Student ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              {t.auth.studentId}
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder={language === "en" ? "e.g. 2110456 or ahmed.k" : "مثال: 2110456 أو ahmed.k"}
              className="min-h-[44px] text-xs font-mono"
              dir="ltr"
              error={Boolean(error && !isUsernameValid)}
            />
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
                <span>{t.auth.loggingIn}</span>
              </>
            ) : (
              t.auth.loginBtn
            )}
          </Button>

          {/* Demo Login Link */}
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors p-2 inline-block"
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

