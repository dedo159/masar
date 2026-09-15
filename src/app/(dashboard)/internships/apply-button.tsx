"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface ApplyButtonProps {
  internshipId: string;
  initialApplied?: boolean;
}

export function ApplyButton({ internshipId, initialApplied = false }: ApplyButtonProps) {
  const { language } = useLanguage();
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
        setError(data.error || (language === "en" ? "Application failed" : "فشل التقديم"));
      }
    } catch {
      setError(language === "en" ? "Connection error" : "حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <div className="flex h-10 min-h-[40px] items-center justify-center gap-1.5 text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 border border-[#0070f3]/20 px-4 rounded-md">
        <CheckCircle2 className="h-4 w-4" />
        <span>{language === "en" ? "Applied Successfully" : "تم التقديم بنجاح"}</span>
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
        className="h-10 min-h-[40px] px-5 text-sm gap-2 font-medium cursor-pointer transition-all active:scale-95 vercel-button-primary"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{language === "en" ? "Submitting Application..." : "جاري إرسال الطلب..."}</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{language === "en" ? "Apply Now" : "تقديم طلب الآن"}</span>
          </>
        )}
      </Button>
      {error && <span className="text-[11px] text-destructive font-medium">{error}</span>}
    </div>
  );
}

