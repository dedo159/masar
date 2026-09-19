"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MasarLogo } from "@/components/ui/logo";
import { ThemeLanguageToggle } from "@/components/ui/theme-language-toggle";

export default function UniversityLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/university/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        router.push("/university/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 relative" dir="rtl">
      {/* Top action: Theme & Language switcher */}
      <div className="absolute top-4 left-4">
        <ThemeLanguageToggle size="sm" />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <MasarLogo size="lg" priority className="mb-4" />
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">بوابة الجامعة</h1>
          <p className="text-gray-500 mt-2 text-sm">تسجيل الدخول لمسؤولي وموظفي الجامعة</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all text-sm"
              placeholder="name@university.edu"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all text-sm"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
