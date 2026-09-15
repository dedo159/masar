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
        setError(data.error || (language === "en" ? "Application failed" : "ظپط´ظ„ ط§ظ„طھظ‚ط¯ظٹظ…"));
      }
    } catch {
      setError(language === "en" ? "Connection error" : "ط­ط¯ط« ط®ط·ط£ ظپظٹ ط§ظ„ط§طھطµط§ظ„");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <div className="flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs font-bold text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-4 rounded-[12px]">
        <CheckCircle2 className="h-4 w-4" />
        <span>{language === "en" ? "Applied Successfully" : "طھظ… ط§ظ„طھظ‚ط¯ظٹظ… ط¨ظ†ط¬ط§ط­"}</span>
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
        className="h-11 min-h-[44px] px-5 text-xs gap-2 font-bold cursor-pointer transition-all active:scale-95 fintech-gradient-teal text-white hover:fintech-glow-teal border-0 rounded-[12px]"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{language === "en" ? "Submitting Application..." : "ط¬ط§ط±ظٹ ط¥ط±ط³ط§ظ„ ط§ظ„ط·ظ„ط¨..."}</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{language === "en" ? "Apply Now" : "طھظ‚ط¯ظٹظ… ط·ظ„ط¨ ط§ظ„ط¢ظ†"}</span>
          </>
        )}
      </Button>
      {error && <span className="text-[11px] text-destructive font-medium">{error}</span>}
    </div>
  );
}

