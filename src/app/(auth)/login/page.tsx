"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Globe, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasarLogo } from "@/components/ui/logo";
import { useLanguage } from "@/components/providers/language-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

const universities = [
  { id: "aau", nameAr: "جامعة عمان الأهلية", nameEn: "Al-Ahliyya Amman University", moodleUrl: "https://vclass.ammanu.edu.jo" },
];

export default function LoginPage() {
  const router = useRouter();
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [selectedUniv, setSelectedUniv] = useState("aau");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  // Realtime field validation indicators
  const isUsernameValid = username.trim().length >= 3;
  const isPasswordValid = password.length >= 4;

  // Check if WebAuthn is available on this device
  useEffect(() => {
    async function checkBiometric() {
      if (
        typeof window !== "undefined" &&
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
      ) {
        try {
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
        } catch {
          setBiometricAvailable(false);
        }
      }
    }
    checkBiometric();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  // --- Biometric Login ---
  const handleBiometricLogin = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setBiometricLoading(true);

    try {
      // 1. Get authentication options from server
      const optionsRes = await fetch("/api/student/auth/passkey/login-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!optionsRes.ok) {
        const data = await optionsRes.json().catch(() => ({}));
        setError(data.error || t.auth.biometricLoginFailed);
        setBiometricLoading(false);
        return;
      }

      const { options } = await optionsRes.json();

      // 2. Start browser biometric prompt
      const authResponse = await startAuthentication({ optionsJSON: options });

      // 3. Verify with server
      const verifyRes = await fetch("/api/student/auth/passkey/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authResponse),
      });

      const verifyData = await verifyRes.json().catch(() => ({}));

      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || t.auth.biometricLoginFailed);
        setBiometricLoading(false);
        return;
      }

      setSuccess(t.auth.loginSuccess);
      if (typeof window !== "undefined") {
        localStorage.setItem("masar_logged_in", "true");
        localStorage.setItem("masar_user_name", verifyData.student?.name || "");
        if (verifyData.student?.major) {
          localStorage.setItem("masar_user_major", verifyData.student.major);
        }
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      // User cancelled the biometric prompt
      if (err instanceof Error && err.name === "NotAllowedError") {
        setBiometricLoading(false);
        return;
      }
      setError(t.auth.biometricLoginFailed);
      setBiometricLoading(false);
    }
  }, [router, t]);

  // --- Biometric Registration (after successful login) ---
  const handleBiometricSetup = async () => {
    setError(null);
    setBiometricLoading(true);

    try {
      // 1. Get registration options
      const optionsRes = await fetch("/api/student/auth/passkey/register-options", {
        method: "POST",
      });

      if (!optionsRes.ok) {
        setError(t.auth.biometricSetupFailed);
        setBiometricLoading(false);
        return;
      }

      const { options } = await optionsRes.json();

      // 2. Start browser biometric registration
      const regResponse = await startRegistration({ optionsJSON: options });

      // 3. Verify with server
      const verifyRes = await fetch("/api/student/auth/passkey/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regResponse),
      });

      const verifyData = await verifyRes.json().catch(() => ({}));

      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || t.auth.biometricSetupFailed);
        setBiometricLoading(false);
        return;
      }

      setSuccess(t.auth.biometricSetupSuccess);
      setShowBiometricSetup(false);

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setBiometricLoading(false);
        return;
      }
      setError(t.auth.biometricSetupFailed);
      setBiometricLoading(false);
    }
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
      // 1. First attempt to log into Masar Student Account
      const authRes = await fetch("/api/student/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: username.trim(),
          password,
          rememberMe,
        }),
      });

      let authData: Record<string, any> = {};
      try {
        authData = await authRes.json();
      } catch {
        authData = {};
      }

      if (authRes.ok && authData.success) {
        setSuccess(t.auth.loginSuccess);
        if (typeof window !== "undefined") {
          localStorage.setItem("masar_logged_in", "true");
          localStorage.setItem("masar_user_name", authData.student?.name || username);
          if (authData.student?.major) {
            localStorage.setItem("masar_user_major", authData.student.major);
          }
        }



        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
        return;
      }

      // 2. If student account not found directly, try connecting Moodle credentials
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
        setError(data.error || authData.error || t.auth.loginFailed);
        setLoading(false);
        return;
      }

      setSuccess(t.auth.loginSuccess);

      if (typeof window !== "undefined") {
        localStorage.setItem("masar_logged_in", "true");
        localStorage.setItem("masar_user_name", data.studentName || data.student?.name || username);
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

  // --- Biometric Setup Modal ---
  if (showBiometricSetup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <MasarLogo size="lg" priority />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm text-center">
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

            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Fingerprint className="h-8 w-8 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">{t.auth.biometricSetup}</h2>
              <p className="text-xs text-muted-foreground mt-1">{t.auth.biometricSetupDesc}</p>
            </div>

            <Button
              onClick={handleBiometricSetup}
              disabled={biometricLoading}
              className="w-full min-h-[44px] text-sm font-semibold gap-2 cursor-pointer"
            >
              {biometricLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.auth.loggingIn}</span>
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4" />
                  <span>{t.auth.biometricSetup}</span>
                </>
              )}
            </Button>

            <button
              onClick={() => {
                setShowBiometricSetup(false);
                router.push("/");
                router.refresh();
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t.auth.biometricSkip}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.auth.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.auth.subtitle}
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
            className="w-full min-h-[44px] text-sm font-semibold gap-2 mt-4 cursor-pointer"
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

          {/* Security Notice */}
          <p className="text-center text-[11px] text-muted-foreground pt-1 leading-relaxed border-t border-border">
            {t.auth.privacyNotice}
          </p>
        </form>
      </div>
    </div>
  );
}
