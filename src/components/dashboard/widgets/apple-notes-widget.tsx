"use client";

import Link from "next/link";
import { PenSquare, Calendar, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface AssignmentItem {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: "pending" | "submitted";
}

export function AppleNotesWidget() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Real mock/live student assignments reflecting Moodle & semester tasks
  const assignments: AssignmentItem[] = [
    {
      id: "note-1",
      title: "تسليم مشروع هندسة البرمجيات — مخطط UML ومعمارية النظام",
      courseName: "هندسة البرمجيات",
      dueDate: "25/8/17",
      status: "pending"
    },
    {
      id: "note-2",
      title: "واجب هياكل البيانات — تنفيذ خوارزمية شجرة AVL والتوازن",
      courseName: "هياكل البيانات",
      dueDate: "25/6/30",
      status: "pending"
    },
    {
      id: "note-3",
      title: "ملاحظات مراجعة امتحان قواعد البيانات والـ SQL Stored Procedures",
      courseName: "قواعد البيانات",
      dueDate: "25/5/9",
      status: "submitted"
    }
  ];

  return (
    <div className="apple-glass-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group h-full min-h-[310px]">
      
      {/* Header Row: Title & Amber Squircle on Start, Compose Action on End */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
        
        {/* Info: Title + Amber Task Squircle Icon */}
        <div className="flex items-center gap-3">
          {/* Amber Academic Tasks Squircle Icon */}
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#ffd60a] to-[#ff9f0a] p-0.5 shadow-lg shrink-0 flex items-center justify-center text-[#161d2d]">
            <PenSquare className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {isAr ? "المهام والواجبات" : "Tasks & Deadlines"}
            </h4>
            <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {isAr ? "المواد المسجلة" : "Enrolled Courses"}
            </span>
          </div>
        </div>

        {/* Action: New Note / View all */}
        <Link
          href="/courses"
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/15 text-amber-300 transition-colors"
          title={isAr ? "عرض كل الواجبات" : "View all tasks"}
        >
          <PenSquare className="h-4 w-4" />
        </Link>

      </div>

      {/* Notes List with Timestamps like in Screenshot */}
      <div className="my-auto divide-y divide-white/[0.08] relative z-10">
        {assignments.map((item) => (
          <Link
            key={item.id}
            href="/courses"
            className="py-3 px-2 rounded-xl flex items-center justify-between gap-3 hover:bg-white/[0.06] transition-colors group/item block"
          >
            {/* Note Snippet */}
            <div className="min-w-0 flex-1">
              <h5 className="text-xs sm:text-sm font-semibold text-white group-hover/item:text-amber-300 transition-colors line-clamp-1 leading-snug">
                {item.title}
              </h5>
              <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                {item.courseName} • {item.status === "submitted" ? (
                  <span className="text-emerald-400 inline-flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> تم التسليم
                  </span>
                ) : (
                  <span className="text-amber-400">قيد الإنجاز</span>
                )}
              </p>
            </div>

            {/* Timestamp (like in Apple screenshot) */}
            <span className="text-xs font-mono text-slate-300 group-hover/item:text-white transition-colors shrink-0 whitespace-nowrap">
              {item.dueDate}
            </span>
          </Link>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
        <span className="text-[11px] font-medium">3 مهام نشطة هذا الفصل</span>
        <Link
          href="/courses"
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>{isAr ? "عرض كل المهام" : "View All"}</span>
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>

    </div>
  );
}
