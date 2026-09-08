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

      const data = await res.json();

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
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>تم التقديم بنجاح</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size="sm"
        onClick={handleApply}
        disabled={loading}
        className="text-xs gap-1.5 font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>جاري التقديم...</span>
          </>
        ) : (
          <>
            <Send className="h-3.5 w-3.5" />
            <span>تقديم طلب الآن</span>
          </>
        )}
      </Button>
      {error && <span className="text-[10px] text-destructive">{error}</span>}
    </div>
  );
}
