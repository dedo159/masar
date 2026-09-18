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
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{isAr ? "فعاليات مقترحة" : "Campus Events"}</span>
            </span>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {isAr ? "هاكاثون الذكاء الاصطناعي 2026" : "Recommended Events"}
            </h4>
            <p className="text-[11px] text-white/50 line-clamp-1">
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

      {/* Job/Internship Matches */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E83D84] flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>{isAr ? "مطابقة تدريب" : "Job Matches"}</span>
            </span>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {isAr ? "فرص التدريب المتوافقة (92%)" : "Job/Internship Matches"}
            </h4>
            <p className="text-[11px] text-white/50 line-clamp-1">
              {isAr ? "مطور برمجيات Fullstack متدرب • عمان" : "Frontend / React Intern • Amman"}
            </p>
          </div>
        </div>

        <Link
          href="/internships"
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#E83D84] hover:from-[#7c3aed] hover:to-[#d82e75] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(232,61,132,0.3)] transition-all active:scale-[0.98]"
        >
          <span>{isAr ? "عرض الفرص المطابقة" : "Join to action"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
