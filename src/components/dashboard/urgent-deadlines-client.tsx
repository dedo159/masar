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
          <div className="bg-[#ff5b4f] text-white p-2 rounded-lg text-foreground shadow-md">
             <AlertTriangle className="h-4 w-4 fill-white/20" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-bold text-foreground">
            {t.dashboard.urgentDeadlines}
          </h2>
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground bg-[#ff5b4f] px-2.5 py-1 rounded-full animate-pulse shadow-md">
              <AlertTriangle className="h-3 w-3" />
              <span>{urgentCount} {t.dashboard.urgentBadge}</span>
            </div>
          )}
        </div>
        <Link
          href="/courses"
          className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-muted hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-border"
        >
          <span>{t.dashboard.allCourses}</span>
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Empty State vs List */}
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center transition-colors">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-xs">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-semibold text-foreground">{t.dashboard.noDeadlines}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
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
                  "flex items-center gap-4 rounded-lg border bg-card p-4 min-h-[56px] relative overflow-hidden group",
                  "transition-all duration-300 ease-out",
                  status === "urgent" ? "border-[#ff5b4f]/40 hover:border-[#ff5b4f]/80 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-border hover:border-border/50 hover:bg-white/[0.02]",
                  "active:scale-[0.98]"
                )}
              >
                {/* Visual Glow for Urgent */}
                {status === "urgent" && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff5b4f]/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                {/* Course color indicator */}
                <div
                  className="h-10 w-1.5 rounded-full flex-shrink-0 z-10"
                  style={{ backgroundColor: assignment.courseColor || "#7C3AED" }}
                />

                {/* Assignment Title & Course Info */}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground truncate transition-colors">
                      {assignmentTitle}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                    {courseDisplayName} · {assignmentTypeLabel}
                  </p>
                </div>

                {/* Status Badge & Due Time */}
                <div className={cn("flex-shrink-0 flex flex-col gap-2 z-10", isRtl ? "text-left items-end" : "text-right items-end")}>
                  {status === "urgent" ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground bg-[#ff5b4f] px-2.5 py-1 rounded-md shadow-md">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.urgentBadge}: {relTime}</span>
                    </div>
                  ) : status === "soon" ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#ff5b4f] bg-[#ff5b4f]/10 px-2.5 py-1 rounded-md border border-[#ff5b4f]/20">
                      <Clock className="h-3 w-3" />
                      <span>{t.dashboard.soonBadge}: {relTime}</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{relTime}</span>
                    </span>
                  )}

                  {assignment.dueTime && assignment.dueTime !== "--:--" && (
                    <span className="text-[11px] text-muted-foreground/60 font-semibold tabular-nums">
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