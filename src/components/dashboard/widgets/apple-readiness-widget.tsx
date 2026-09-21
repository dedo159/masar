"use client";

import Link from "next/link";
import { Sparkles, ArrowUpRight, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function AppleReadinessWidget() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="apple-glass-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group h-full min-h-[310px]">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title + Apple Photos Style Multi-Colored Squircle */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* Masar AI Career Icon */}
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
            <div className="h-full w-full bg-[#161d2d] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#38bdf8]" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {isAr ? "المسار المهني الذكي" : "AI Career Readiness"}
            </h4>
            <span className="text-[11px] text-blue-400/90 block font-medium">
              {isAr ? "تحليل الجاهزية والمهارات" : "Skills & Market Match"}
            </span>
          </div>
        </div>

        <Link
          href="/readiness"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>{isAr ? "فتح المسار" : "Open"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Center Content: Large Multi-Colored Title & Description */}
      <div className="my-auto py-6 text-center space-y-3 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-white">{isAr ? "فحص الجاهزية " : "Assess Your "}</span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-black">
            {isAr ? "المهنية الذكي" : "Career Readiness"}
          </span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto font-normal">
          {isAr
            ? "يقوم محرك مسار بتحليل مقرراتك الأكاديمية ومشاريع GitHub لاستخراج المهارات المحققة وتحديد الفجوات التقنية وربطك بفرص التدريب المناسبة."
            : "Analyze your university courses and GitHub repositories to verify skills, pinpoint technical gaps, and connect with top internships."}
        </p>
      </div>

      {/* Footer Action Button */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>{isAr ? "مزامنة مباشرة مع سوق العمل" : "Live Industry Alignment"}</span>
        </div>

        <Link
          href="/readiness"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-xs font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isAr ? "فحص الجاهزية الآن" : "Start Career Scan"}</span>
        </Link>
      </div>

    </div>
  );
}
