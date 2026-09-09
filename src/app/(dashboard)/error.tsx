"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6" strokeWidth={1.75} />
        </div>

        <h2 className="text-base font-semibold text-foreground">
          تعذّر تحميل الصفحة الرئيسية
        </h2>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          نعتذر، واجه النظام خطأً غير متوقع أثناء استرجاع بياناتك الأكاديمية. يرجى المحاولة مرة أخرى أو العودة لاحقاً.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-3 p-2 text-left rounded bg-secondary/80 text-[11px] font-mono text-muted-foreground break-words" dir="ltr">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6">
          <Button
            onClick={() => reset()}
            variant="default"
            size="default"
            className="w-full sm:w-auto gap-2 min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>إعادة المحاولة</span>
          </Button>

          <Link
            href="/courses"
            className="inline-flex h-11 min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 text-sm font-medium text-foreground hover:bg-secondary active:scale-[0.98] transition-all"
          >
            <Home className="h-4 w-4" />
            <span>الانتقال للمساقات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
