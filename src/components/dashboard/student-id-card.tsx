"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle2, Award, QrCode, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { Student } from "@/lib/types";

interface StudentIdCardProps {
  student?: Student | null;
}

export function StudentIdCard({ student }: StudentIdCardProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === "ar";

  const studentName = student?.name || (isAr ? "طالب مسار" : "Masar Student");
  const studentIdNumber = student?.studentId || "202410890";
  const studentMajor = student?.major || (isAr ? "علم الحاسوب" : "Computer Science");
  const totalCredits = student?.totalCredits || 132;
  const completedCredits = student?.completedCredits || 78;
  const progressPercent = Math.min(100, Math.max(0, Math.round((completedCredits / totalCredits) * 100)));
  const gpa = student?.gpa ? Number(student.gpa).toFixed(2) : "3.45";

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 sm:p-5 shadow-2xl backdrop-blur-2xl overflow-hidden group">
      {/* Top Hairline Glowing Gradient Border */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2F7BFF]/60 via-[#E83D84]/60 to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#2F7BFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#E83D84]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
            {isAr ? "الهوية الأكاديمية والتقدم الجامعي" : "Academic Identity & Progress"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2F7BFF]/15 text-[#38BDF8] border border-[#2F7BFF]/30">
            {isAr ? "طالب منتظم" : "Active Student"}
          </span>
        </div>
        <Link
          href="/profile"
          className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
        >
          <span>{isAr ? "الملف الأكاديمي" : "Full Profile"}</span>
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>

      {/* Profile & Info Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] opacity-80 blur-[2px]" />
            <div className="relative h-13 w-13 rounded-full overflow-hidden border border-white/30 bg-[#141630]">
              <img
                src={student?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={studentName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight truncate flex items-center gap-1.5">
              <span>{studentName}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
            </h3>
            <p className="text-xs font-mono text-white/60 truncate mt-0.5">
              {isAr ? `الرقم الجامعي: ${studentIdNumber}` : `Student ID: ${studentIdNumber}`}
            </p>
            <p className="text-[11px] text-white/40 truncate">
              {studentMajor} • {isAr ? "الجامعة الأردنية" : "University of Jordan"}
            </p>
          </div>
        </div>

        {/* Right: Quick KPI Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
            <span className="text-[10px] text-white/50 block font-medium">
              {isAr ? "المعدل التراكمي" : "GPA"}
            </span>
            <span className="text-sm font-bold font-mono text-[#38BDF8]">
              {gpa}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
            <span className="text-[10px] text-white/50 block font-medium">
              {isAr ? "الساعات المنجزة" : "Credits"}
            </span>
            <span className="text-sm font-bold font-mono text-[#E83D84]">
              {completedCredits}/{totalCredits}
            </span>
          </div>

          <Link
            href="/deals"
            className="rounded-xl border border-[#2F7BFF]/30 bg-gradient-to-r from-[#2F7BFF]/15 to-[#E83D84]/15 hover:from-[#2F7BFF]/25 hover:to-[#E83D84]/25 px-3 py-2 flex flex-col items-center justify-center transition-all group/btn"
          >
            <div className="flex items-center gap-1 text-[10px] text-[#38BDF8] font-semibold">
              <QrCode className="h-3 w-3" />
              <span>{isAr ? "بطاقة الخصم" : "Student Pass"}</span>
            </div>
            <span className="text-[10px] text-white/70 font-mono">
              {isAr ? "نشطة ⚡" : "Active ⚡"}
            </span>
          </Link>
        </div>
      </div>

      {/* Degree Graduation Progress Bar */}
      <div className="space-y-2 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-white/70 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>{isAr ? "التقدم نحو التخرج وإنهاء الخطة الدراسية" : "Degree Completion Progress"}</span>
          </div>
          <span className="font-mono text-xs font-bold bg-gradient-to-r from-[#00D2FF] to-[#E83D84] bg-clip-text text-transparent">
            {progressPercent}%
          </span>
        </div>

        {/* Neon Gradient Progress Bar */}
        <div className="relative h-2 w-full rounded-full bg-white/[0.08] overflow-hidden p-[0.5px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] shadow-[0_0_12px_rgba(232,61,132,0.5)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-white/40 font-mono pt-0.5">
          <span>{isAr ? `أنجزت ${completedCredits} ساعة` : `${completedCredits} credits completed`}</span>
          <span>{isAr ? `متبقي ${Math.max(0, totalCredits - completedCredits)} ساعة` : `${Math.max(0, totalCredits - completedCredits)} credits left`}</span>
        </div>
      </div>
    </div>
  );
}
