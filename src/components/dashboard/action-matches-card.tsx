"use client";

import Link from "next/link";
import { Calendar, Briefcase, ArrowUpRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function ActionMatchesCard() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Recommended Events */}
      <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-4 shadow-sm dark:shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-[#38BDF8] flex items-center gap-1 font-semibold">
              <Calendar className="h-3 w-3" />
              <span>{isAr ? "فعاليات مقترحة" : "Campus Events"}</span>
            </span>
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {isAr ? "هاكاثون الذكاء الاصطناعي 2026" : "Recommended Events"}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {isAr ? "كلية الملك عبد الله الثاني لتكنولوجيا المعلومات" : "KASIT Hackathon • 3 days left"}
            </p>
          </div>
        </div>

        <Link
          href="/announcements"
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#2F7BFF] to-[#A855F7] hover:from-[#256be6] hover:to-[#9333ea] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(47,123,255,0.3)] transition-all active:scale-[0.98]"
        >
          <span>{isAr ? "استكشف وسجل الآن" : "Join to action"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Career Readiness & Skill Path */}
      <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-4 shadow-sm dark:shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 dark:text-[#E83D84] flex items-center gap-1 font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>{isAr ? "الجاهزية المهنية" : "Career Readiness"}</span>
            </span>
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {isAr ? "تحليل الكود والمهارات التقنية" : "Code & Skill Analysis"}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {isAr ? "فحص مستودعات GitHub وبناء ملف المهارات" : "GitHub Audit & Verified Tech Stack"}
            </p>
          </div>
        </div>

        <Link
          href="/readiness"
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#E83D84] hover:from-[#7c3aed] hover:to-[#d82e75] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(232,61,132,0.3)] transition-all active:scale-[0.98]"
        >
          <span>{isAr ? "استعراض مسار الجاهزية" : "Explore Path"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
