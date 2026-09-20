"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle2, QrCode } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { Student } from "@/lib/types";

interface StudentIdCardProps {
  student?: Student | null;
}

export function StudentIdCard({ student }: StudentIdCardProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === "ar";

  const studentName = student?.name || (isAr ? "طالب مسار" : "Masar Student");
  const studentIdNumber = student?.studentId || "";
  const studentMajor = student?.major || "";

  return (
    <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] p-4 sm:p-5 shadow-sm dark:shadow-2xl backdrop-blur-2xl overflow-hidden group">
      {/* Top Hairline Glowing Gradient Border */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2F7BFF]/60 via-[#E83D84]/60 to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#2F7BFF]/10 dark:bg-[#2F7BFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#E83D84]/10 dark:bg-[#E83D84]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-foreground">
            {isAr ? "الهوية الأكاديمية والبطاقة الجامعية" : "Academic Identity & Student Pass"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2F7BFF]/10 dark:bg-[#2F7BFF]/15 text-[#2F7BFF] dark:text-[#38BDF8] border border-[#2F7BFF]/20 dark:border-[#2F7BFF]/30">
            {isAr ? "طالب منتظم" : "Active Student"}
          </span>
        </div>
        <Link
          href="/profile"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{isAr ? "الملف الأكاديمي" : "Full Profile"}</span>
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>

      {/* Profile & Info Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] opacity-80 blur-[2px]" />
            <div className="relative h-13 w-13 rounded-full overflow-hidden border-2 border-white dark:border-white/30 bg-gradient-to-br from-[#2F7BFF]/20 to-[#E83D84]/20 flex items-center justify-center">
              {student?.avatar ? (
                <img
                  src={student.avatar}
                  alt={studentName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-foreground">
                  {studentName ? studentName.charAt(0) : "ط"}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground tracking-tight truncate flex items-center gap-1.5">
              <span>{studentName}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2F7BFF] dark:text-[#38BDF8] shrink-0" />
            </h3>
            <p className="text-xs font-mono text-muted-foreground truncate mt-0.5">
              {isAr ? `الرقم الجامعي: ${studentIdNumber}` : `Student ID: ${studentIdNumber}`}
            </p>
            <p className="text-[11px] text-muted-foreground/80 truncate">
              {studentMajor} • {isAr ? "جامعة عمان الأهلية" : "Al-Ahliyya Amman University"}
            </p>
          </div>
        </div>

        {/* Right: Quick Pass / Status Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-xl border border-border/80 dark:border-white/10 bg-muted/50 dark:bg-white/[0.04] px-3.5 py-2 text-start">
            <span className="text-[10px] text-muted-foreground block font-medium">
              {isAr ? "حالة القيد الأكاديمي" : "Academic Status"}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {isAr ? "منتظم ومسجل" : "Enrolled & Active"}
            </span>
          </div>

          <Link
            href="/profile"
            className="rounded-xl border border-[#2F7BFF]/30 bg-gradient-to-r from-[#2F7BFF]/10 to-[#E83D84]/10 hover:from-[#2F7BFF]/20 hover:to-[#E83D84]/20 px-3.5 py-2 flex flex-col items-center justify-center transition-all group/btn shadow-sm"
          >
            <div className="flex items-center gap-1 text-[10px] text-[#2F7BFF] dark:text-[#38BDF8] font-semibold">
              <QrCode className="h-3.5 w-3.5" />
              <span>{isAr ? "البطاقة الجامعية" : "Student Pass"}</span>
            </div>
            <span className="text-[10px] text-foreground/70 dark:text-white/70 font-mono mt-0.5">
              {isAr ? "معتمدة رسمياً ⚡" : "Verified ⚡"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
