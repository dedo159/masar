"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  useEffect(() => {
    console.error("Profile Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6" strokeWidth={1.75} />
        </div>

        <h2 className="text-base font-semibold text-foreground">
          {isEn ? "Unable to load student profile" : "تعذّر تحميل الملف الشخصي"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {isEn
            ? "An error occurred while retrieving student profile data from the server. Please retry or check your connection."
            : "حدث خطأ أثناء جلب بيانات الطالب من الخادم. يرجى المحاولة مرة أخرى أو تفقد حالة اتصالك."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6">
          <Button
            onClick={() => reset()}
            variant="default"
            size="default"
            className="w-full sm:w-auto gap-2 min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{isEn ? "Retry" : "إعادة المحاولة"}</span>
          </Button>

          <Link
            href="/"
            className="inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 text-sm font-medium text-foreground hover:bg-secondary active:scale-[0.98] transition-all"
          >
            <Home className="h-4 w-4" />
            <span>{isEn ? "Back to Home" : "العودة للرئيسية"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
