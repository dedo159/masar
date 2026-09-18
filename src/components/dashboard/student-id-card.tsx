"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function StudentIdCard() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-2xl backdrop-blur-2xl overflow-hidden group">
      {/* Top Hairline Glowing Gradient Border */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2F7BFF]/60 via-[#E83D84]/60 to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#2F7BFF]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#E83D84]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <Link
        href="/profile"
        className="flex items-center justify-between mb-4 group/header cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-white group-hover/header:text-[#2F7BFF] transition-colors">
            {isAr ? "بطاقة الطالب والتقدم الدراسي" : "Student ID & Progress"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#2F7BFF]/15 text-[#38BDF8] border border-[#2F7BFF]/30">
            {isAr ? "نشط" : "Active"}
          </span>
        </div>
        <ChevronLeft className="h-4 w-4 text-white/60 group-hover/header:text-white group-hover/header:translate-x-[-2px] transition-all" />
      </Link>

      {/* Student Profile Info */}
      <div className="flex items-center gap-3.5 mb-4">
        {/* Avatar with glowing ring */}
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] opacity-80 blur-[2px]" />
          <div className="relative h-13 w-13 rounded-full overflow-hidden border border-white/30 bg-[#141630]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Student Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Name and ID */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white tracking-tight truncate flex items-center gap-1.5">
            <span>{isAr ? "عمر خالد السعيد" : "Omar Khaled Al-Saeed"}</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
          </h3>
          <p className="text-xs font-mono text-white/60 truncate mt-0.5">
            {isAr ? "الرقم الجامعي: 202310890" : "ID: 202310890"}
          </p>
          <p className="text-[11px] text-white/40 truncate">
            {isAr ? "هندسة البرمجيات • الجامعة الأردنية" : "Software Engineering • UJ"}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2 pt-1 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70 font-medium">
            {isAr ? "الجدول والمقررات والواجبات" : "Schedules & Assignments"}
          </span>
          <span className="font-mono text-[11px] font-bold text-[#E83D84]">
            78%
          </span>
        </div>

        {/* Neon Gradient Progress Bar */}
        <div className="relative h-2.5 w-full rounded-full bg-white/[0.08] overflow-hidden p-[1px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] via-[#2F7BFF] to-[#E83D84] shadow-[0_0_12px_rgba(232,61,132,0.5)] transition-all duration-700"
            style={{ width: "78%" }}
          />
        </div>
      </div>
    </div>
  );
}
