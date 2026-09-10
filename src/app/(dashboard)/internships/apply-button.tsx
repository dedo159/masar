"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Send } from "lucide-react";

interface ApplyButtonProps {
  internshipId: string;
  initialApplied?: boolean;
}

export function ApplyButton({ internshipId, initialApplied = false }: ApplyButtonProps) {
  const [applied, setApplied] = useState(initialApplied);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (applied || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/student/internships/${internshipId}/apply`, {
        method: "POST",
      });

      let data: Record<string, string> = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok || res.status === 409) {
        setApplied(true);
      } else {
        setError(data.error || "فشل التقديم");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <div className="flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 rounded-lg">
        <CheckCircle2 className="h-4 w-4" />
        <span>تم التقديم بنجاح</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch sm:items-end gap-1">
      <Button
        variant="default"
        size="default"
        onClick={handleApply}
        disabled={loading}
        className="h-11 min-h-[44px] px-5 text-xs gap-2 font-semibold cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>جاري إرسال الطلب...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>تقديم طلب الآن</span>
          </>
        )}
      </Button>
      {error && <span className="text-[11px] text-destructive font-medium">{error}</span>}
    </div>
  );
}
