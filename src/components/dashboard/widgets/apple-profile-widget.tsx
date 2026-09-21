"use client";

import Link from "next/link";
import { Cloud, CheckCircle2, ChevronLeft, Award } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { Student } from "@/lib/types";

interface AppleProfileWidgetProps {
  student?: Student | null;
}

export function AppleProfileWidget({ student }: AppleProfileWidgetProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const studentName = student?.name || "Deyaauldeen";
  const studentEmail = student?.email || "deyaamalkawi2008@outlook.com";
  const studentMajor = student?.major || "هندسة البرمجيات";
  const gpa = student?.gpa || 3.42;

  // Format email with ellipsis like in the Apple screenshot
  const displayEmail = studentEmail.length > 24 
    ? `...${studentEmail.slice(-22)}` 
    : studentEmail;

  return (
    <div className="apple-glass-card p-6 sm:p-7 flex flex-col items-center justify-center text-center relative overflow-hidden group h-full min-h-[310px]">
      {/* Subtle Cloud Atmospheric Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0071e3]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      {/* Luminous Academic Halo framing the avatar */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Sleek Dual Concentric Ring Halo */}
        <div className="absolute -inset-3 rounded-full border border-blue-400/20 shadow-[0_0_35px_rgba(47,123,255,0.2)] pointer-events-none transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute -inset-6 rounded-full border border-blue-500/10 pointer-events-none" />

        {/* Circular Avatar */}
        <div className="relative h-24 w-24 sm:h-26 sm:w-26 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-105">
          {student?.avatar ? (
            <img
              src={student.avatar}
              alt={studentName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-white">
              {studentName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* User Name & Details */}
      <div className="relative z-10 space-y-1 w-full max-w-xs">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <span>{studentName}</span>
          <CheckCircle2 className="h-4 w-4 text-[#38bdf8] shrink-0" />
        </h3>

        <p className="text-xs font-mono text-slate-300 font-medium truncate dir-ltr">
          {displayEmail}
        </p>

        {/* Academic Meta Tags */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-200">
          <span className="bg-white/[0.12] text-white font-medium px-2.5 py-0.5 rounded-full border border-white/15">
            {studentMajor}
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold font-mono">
            GPA: {gpa}
          </span>
        </div>
      </div>

      {/* Bottom Brand Link */}
      <div className="mt-5 pt-3 border-t border-white/10 w-full flex items-center justify-between text-xs text-slate-300 relative z-10">
        <div className="flex items-center gap-1.5 text-white font-medium">
          <Award className="h-4 w-4 text-blue-400" />
          <span>{isAr ? "منظومة مسار الجامعية" : "Masar Academic Pass"}</span>
        </div>

        <Link
          href="/profile"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5 font-medium transition-colors"
        >
          <span>{isAr ? "الملف الأكاديمي" : "Full Pass"}</span>
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>

    </div>
  );
}
