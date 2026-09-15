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
        <div className="flex items-center gap-3">
          <div className="fintech-gradient-orange p-2 rounded-xl text-white shadow-md">
             <AlertTriangle className="h-4 w-4 fill-white/20" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-bold text-white">
            {t.dashboard.urgentDeadlines}
          </h2>
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#EF4444] px-2.5 py-1 rounded-full animate-pulse shadow-md">
              <AlertTriangle className="h-3 w-3" />
              <span>{urgentCount} {t.dashboard.urgentBadge}</span>
            </div>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/5"
        >
          <span>{t.dashboard.allCourses}</span>
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Empty State vs List */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-[20px] border border-dashed border-white/10 bg-card text-center transition-colors">
          <div className="h-14 w-14 rounded-2xl fintech-gradient-teal flex items-center justify-center mb-4 text-white shadow-lg">
            <CheckCircle2 className="h-6 w-6 fill-white/20" strokeWidth={2} />
          </div>
          <p className="text-base font-bold text-white">{t.dashboard.noDeadlines}</p>
          <p className="text-xs text-white/50 mt-1 max-w-sm font-medium">
            {t.dashboard.allCaughtUp}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
                  "flex items-center gap-4 rounded-[20px] border bg-card p-4 min-h-[56px] relative overflow-hidden group",
                  "transition-all duration-300 ease-out",
                  status === "urgent" ? "border-[#EF4444]/40 hover:border-[#EF4444]/80 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-white/5 hover:border-white/20 hover:bg-white/[0.02]",
                  "active:scale-[0.98]"
                )}
              >
                {/* Visual Glow for Urgent */}
                {status === "urgent" && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF4444]/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                {/* Course color indicator */}
                <div
                  className="h-10 w-1.5 rounded-full flex-shrink-0 z-10"
                  style={{ backgroundColor: assignment.courseColor || "#7C3AED" }}
                />

                {/* Assignment Title & Course Info */}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate transition-colors">
                      {assignmentTitle}
                    </p>
                  </div>
                  <p className="text-xs text-white/50 mt-1 truncate font-medium">
                    {courseDisplayName} · {assignmentTypeLabel}
                  </p>
                </div>

                {/* Status Badge & Due Time */}
                <div className={cn("flex-shrink-0 flex flex-col gap-2 z-10", isRtl ? "text-left items-end" : "text-right items-end")}>
                  {status === "urgent" ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#EF4444] px-2.5 py-1 rounded-md shadow-md">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.urgentBadge}: {relTime}</span>
                    </div>
                  ) : status === "soon" ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F97316] bg-[#F97316]/10 px-2.5 py-1 rounded-md border border-[#F97316]/20">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.soonBadge}: {relTime}</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{relTime}</span>
                    </span>
                  )}

                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <span className="text-[11px] text-white/40 font-semibold tabular-nums">
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