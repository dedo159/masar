"use client";

import Link from "next/link";
import { getDeadlineStatus, getRelativeTime, cn } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowLeft, ArrowRight, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { translateCourseName, translateAssignmentTitle } from "@/lib/translations/academic";
import type { Assignment } from "@/lib/types";

export interface DeadlineItem extends Assignment {
  courseNameAr: string;
  courseNameEn?: string;
  courseId: string;
  courseColor: string;
}

interface UrgentDeadlinesClientProps {
  upcoming: DeadlineItem[];
  urgentCount: number;
}

export function UrgentDeadlinesClient({ upcoming, urgentCount }: UrgentDeadlinesClientProps) {
  const { t, isRtl, language } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#E83D84] to-[#F43F5E] flex items-center justify-center text-white shadow-[0_0_15px_rgba(232,61,132,0.4)]">
             <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            {t.dashboard.urgentDeadlines}
          </h2>
          {urgentCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              <span>{urgentCount} {t.dashboard.urgentBadge}</span>
            </div>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 rounded-full transition-all border border-white/10"
        >
          <span>{t.dashboard.allCourses}</span>
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Empty State vs List */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl text-center transition-colors">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#00D2FF]/20 to-[#2F7BFF]/20 border border-[#2F7BFF]/30 flex items-center justify-center mb-3 text-[#38BDF8] shadow-[0_0_20px_rgba(47,123,255,0.2)]">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="text-sm font-bold text-white">{t.dashboard.noDeadlines}</p>
          <p className="text-xs text-white/50 mt-1 max-w-sm font-medium">
            {t.dashboard.allCaughtUp}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((assignment) => {
            const status = getDeadlineStatus(assignment.dueDate, assignment.dueTime);
            const relTime = getRelativeTime(assignment.dueDate, assignment.dueTime, language === "en" ? "en" : "ar");
            const courseDisplayName = translateCourseName(undefined, assignment.courseNameAr, assignment.courseNameEn, language);
            const assignmentTitle = translateAssignmentTitle(assignment.title, language);
            const assignmentTypeLabel = t.dashboard.assignmentTypes[assignment.type] || assignment.type;

            return (
              <Link
                key={assignment.id}
                href={"/courses/" + assignment.courseId}
                className={cn(
                  "flex items-center gap-3.5 rounded-2xl border p-3.5 relative overflow-hidden group",
                  "backdrop-blur-xl transition-all duration-300 ease-out",
                  status === "urgent"
                    ? "border-rose-500/30 bg-gradient-to-r from-rose-500/[0.08] to-white/[0.02] hover:border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.12)]"
                    : "border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] hover:border-white/20 hover:bg-white/[0.06]",
                  "active:scale-[0.99]"
                )}
              >
                {/* Visual Glow for Urgent */}
                {status === "urgent" && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                {/* Course color indicator */}
                <div
                  className="h-10 w-1 rounded-full flex-shrink-0 z-10 shadow-sm"
                  style={{ backgroundColor: assignment.courseColor || "#2F7BFF" }}
                />

                {/* Assignment Title & Course Info */}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate transition-colors group-hover:text-[#38BDF8]">
                      {assignmentTitle}
                    </p>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 truncate font-medium">
                    {courseDisplayName} · {assignmentTypeLabel}
                  </p>
                </div>

                {/* Status Badge & Due Time */}
                <div className={cn("flex-shrink-0 flex flex-col gap-1.5 z-10", isRtl ? "text-left items-end" : "text-right items-end")}>
                  {status === "urgent" ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-lg shadow-sm">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.urgentBadge}: {relTime}</span>
                    </div>
                  ) : status === "soon" ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.soonBadge}: {relTime}</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/70 bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                      <Calendar className="h-3 w-3 text-white/50" />
                      <span>{relTime}</span>
                    </span>
                  )}

                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <span className="text-[10px] text-white/40 font-mono">
                      {t.dashboard.atHour} {assignment.dueTime}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}