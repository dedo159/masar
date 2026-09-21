"use client";

import Link from "next/link";
import { Folder, Clock, ChevronLeft, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface DriveFile {
  id: string;
  name: string;
  ext: "XLSX" | "M4A" | "DOCX" | "PDF";
  course: string;
  date: string;
}

export function AppleDriveWidget() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Files matching the Apple iCloud Drive 2-column layout with authentic colorful badges
  const files: DriveFile[] = [
    {
      id: "f-1",
      name: "بطاقات_الجلوس_لامتحان_شهادة_الدراسة_الجامعية",
      ext: "PDF",
      course: "عمادة القبول والتسجيل",
      date: "25/9/12"
    },
    {
      id: "f-2",
      name: "خطة_توزيع_علامات_مقررات_الفصل_الثاني",
      ext: "XLSX",
      course: "هندسة البرمجيات",
      date: "25/8/20"
    },
    {
      id: "f-3",
      name: "تسجيل_صوتي_محاضرة_خوارزميات_الفرز_المتقدمة",
      ext: "M4A",
      course: "الخوارزميات",
      date: "25/7/15"
    },
    {
      id: "f-4",
      name: "وثيقة_معمارية_مشروع_الأنظمة_الموزعة_v2",
      ext: "DOCX",
      course: "نظم موزعة",
      date: "25/6/10"
    },
    {
      id: "f-5",
      name: "تسجيل_مناقشة_مشروع_هياكل_البيانات_الحلقة_4",
      ext: "M4A",
      course: "هياكل البيانات",
      date: "25/5/28"
    },
    {
      id: "f-6",
      name: "دليل_مواصفات_متطلبات_النظام_SRS_الرسمي",
      ext: "DOCX",
      course: "هندسة البرمجيات",
      date: "25/5/14"
    }
  ];

  const getBadgeStyle = (ext: DriveFile["ext"]) => {
    switch (ext) {
      case "XLSX":
        return {
          bg: "bg-[#107c41]/20 text-[#21a366] border-[#107c41]/40",
          iconColor: "text-[#21a366]"
        };
      case "M4A":
        return {
          bg: "bg-[#ff2d55]/20 text-[#ff375f] border-[#ff2d55]/40",
          iconColor: "text-[#ff375f]"
        };
      case "DOCX":
        return {
          bg: "bg-[#0078d4]/20 text-[#2b88d8] border-[#0078d4]/40",
          iconColor: "text-[#2b88d8]"
        };
      case "PDF":
        return {
          bg: "bg-[#af52de]/20 text-[#bf5af2] border-[#af52de]/40",
          iconColor: "text-[#bf5af2]"
        };
    }
  };

  return (
    <div className="apple-glass-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group h-full min-h-[310px]">
      
      {/* Header Row: Title & Folder Squircle on Start, Browse Action on End */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
        
        {/* Info: Title + Folder Squircle Icon */}
        <div className="flex items-center gap-3">
          {/* Blue Folder Squircle Icon */}
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#007aff] to-[#0051ba] p-0.5 shadow-lg shrink-0 flex items-center justify-center text-white">
            <Folder className="w-5 h-5 fill-white/30" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {isAr ? "المحاضرات والملفات" : "Course Materials"}
            </h4>
            <span className="text-[11px] text-blue-400/90 font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isAr ? "الملفات والمستندات الحديثة" : "Recent Files"}
            </span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          href="/courses"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>{isAr ? "استعراض المواد" : "Browse Courses"}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

      </div>

      {/* 2-Column Grid of Files like in the Apple iCloud Screenshot */}
      <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 relative z-10">
        {files.map((file) => {
          const badge = getBadgeStyle(file.ext);
          return (
            <Link
              key={file.id}
              href="/courses"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-all group/file"
            >
              {/* Colorful Extension Badge inside Squircle */}
              <div
                className={`h-7 w-7 rounded-lg border flex items-center justify-center text-[10px] font-bold font-mono shrink-0 shadow-sm transition-transform group-hover/file:scale-110 ${badge.bg}`}
              >
                {file.ext}
              </div>

              {/* File Info */}
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-semibold text-white truncate group-hover/file:text-blue-300 transition-colors">
                  {file.name}
                </h5>
                <p className="text-[10px] text-white/65 truncate mt-0.5 font-medium">
                  {file.course} • {file.date}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 relative z-10">
        <span className="text-[11px]">مزامنة مباشرة مع سحابة الجامعة و Moodle</span>
        <Link
          href="/courses"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>{isAr ? "كل المحاضرات والملفات" : "All Files"}</span>
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>

    </div>
  );
}
